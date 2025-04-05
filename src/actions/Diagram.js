"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateSummaryEmbedding } from "../lib/gemini";
import { getPineconeClient } from "../lib/pinecone";
import { auth } from "../auth";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { connect } from "../lib/db";
import ProjectFiles from "../models/ProjectFiles";
const model = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const GenerateDiagram = async (projectId, query) => {
  console.log("projectId", projectId);
  console.log("query", query);
  const session = await auth();
  const userId = session?.user?._id;
  if (!session) {
    return;
  }
  console.log("userId", userId);
  await connect();
  try {
    const embeddings = await generateSummaryEmbedding(query);
    const pineconeIndex = await getPineconeClient();
    const res = await pineconeIndex.namespace(projectId).query({
      vector: embeddings,
      topK: 8,
      includeValues: true,
      includeMetadata: true,
    });
    res.matches.sort((a, b) => b.score - a.score);
    const files = [];
    let context = "";
    for (const match of res.matches) {
      const file = await ProjectFiles.findById(match.id).select("-__v").lean();
      if (file) {
        files.push(JSON.parse(JSON.stringify(file)));
        context += `file name is ${file.fileName} and the file content is ${file.fileContent} and summary of the file is ${file.summary}\n\n`;
      }
    }
    const { text } = await generateText({
      model: model("gemini-2.0-flash-lite"),
      apiKey: process.env.GEMINI_API_KEY,
      prompt: `
    You are an AI assistant specialized in creating Mermaid JS diagrams from code repositories. Your task is to analyze the provided repository files and generate simple, clean Mermaid diagrams based on user queries.

    === START OF CONTEXT OBJECT ===
    The following repository details are provided as context:
    1. **Filenames**: The names of the files in the repository.
    2. **Code**: The actual source code within each file.
    3. **Summaries**: A brief explanation of what each file does, including its purpose, key functions, and interactions with other files.

    Here is the provided repository context:
    ${JSON.stringify(context, null, 2)}
    === END OF CONTEXT OBJECT ===

    ### **Instructions for Diagram Generation:**
    - Generate ONLY Mermaid JS code with no preamble, explanations, or additional information
    - Create SIMPLE diagrams with minimal nodes and clear connections
    - Avoid complex syntax or nested structures
    - Keep node labels brief and descriptive
    - Limit the number of elements to improve readability
    - Use a consistent style throughout the diagram

    ### **Strict Naming Conventions:**
    - **All node names must be enclosed in double quotes ("")** if they contain spaces, special characters, or reserved words.
    - **Brackets ([ ]) should only be used to denote specific Mermaid syntax (e.g., process nodes, database nodes).** 
    - **Do NOT wrap entire node labels in brackets unless required by Mermaid syntax.**
    - **Use PascalCase or camelCase for internal identifiers and avoid spaces in node IDs.**
    - **Keep labels meaningful but concise.**

    ### **Essential Mermaid Syntax Rules:**
    1. **General Syntax:**
       - Each diagram starts with a declaration of its type (flowchart, graph, sequenceDiagram, etc.)
       - Spaces matter in Mermaid syntax
       - Indentation is not required but helps with reading

    2. **Flow Charts:**
       - Use \`graph TD\` (top-down) or \`graph LR\` (left-right) to begin
       - Define nodes with identifiers: \`A["Label"]\`
       - Connect nodes with arrows: \`A --> B\`
       - For labeled connections: \`A -->|"Label"| B\`
       - For decision nodes use diamonds: \`A{"Decision"}\`
       - For process nodes use rectangles: \`A["Process"]\`

    3. **Sequence Diagrams:**
       - Start with \`sequenceDiagram\`
       - Define participants: \`participant "User"\` or \`actor "System"\`
       - Show interactions: \`"User" ->> "API": Send Request\`
       - Use \`-->>\` for dotted arrows
       - Use \`-x\` for lost messages

    4. **Class Diagrams:**
       - Start with \`classDiagram\`
       - Define classes: \`class "UserService"\`
       - Define methods: \`"UserService" : +getUser()\`
       - Define relationships: \`"UserController" --> "UserService": calls\`

    5. **Error Prevention:**
       - **Always wrap multi-word node labels in double quotes ("")**
       - **Avoid using : in node labels unless necessary**
       - **Escape special characters when needed**
       - **Keep node IDs simple (alphanumeric)**
       - **Avoid excessively long text in nodes**

    ### **Examples of Expected Output:**
    
    Example 1: For a request to visualize a user management system:
    \`\`\`mermaid
    graph TD
        "Controller" --> "Service"
        "Service" --> "Repository"
        "Repository" --> "Database"
    \`\`\`

    Example 2: For a request to show authentication flow:
    \`\`\`mermaid
    graph TD
        "Client" --> "Has Token?"
        "Has Token?" -->|"Yes"| "Validate"
        "Has Token?" -->|"No"| "Login"
        "Validate" -->|"Valid"| "Access"
    \`\`\`

    Example 3: For a request to visualize API interactions:
    \`\`\`mermaid
    sequenceDiagram
        "Client"->>"API": Request
        "API"->>"AuthService": Validate
        "AuthService"-->>"API": Valid
        "API"-->>"Client": Response
    \`\`\`

    === START OF USER QUERY ===
    ${query}
    === END OF USER QUERY ===
`,
    });
    console.log("diagram", text);
    const match = text.match(/```mermaid\s*([\s\S]*?)\s*```/);
    return match ? match[1] : text;
  } catch (error) {
    console.error("Error generating diagram:", error);
  }
};
export const fixMermaidCode = async (code, error) => {
  console.log("correcting code");
  console.log("code", code);
  console.log("error", error);
  const { text } = await generateText({
    model: model("gemini-2.0-flash-lite"),
    apiKey: process.env.GEMINI_API_KEY,
    prompt: `
        You are an expert in Mermaid.js syntax and diagram generation.
        Your task is to analyze the provided Mermaid code, identify errors, and correct them.
  
        ### **Mermaid.js Rules & Guidelines**
        - Mermaid diagrams must follow the correct syntax (refer to https://mermaid.js.org/).
        - Every node must have a valid identifier.
        - Arrows (--> or --|Text|-->) must connect valid nodes.
        - Parentheses, brackets, and braces must be used correctly.
        - Conditional nodes {} must have valid paths.
        - Ensure proper indentation and formatting for clarity.
  
        ### **Task Instructions:**
        - Analyze the provided code for syntax and logical errors.
        - Fix issues while preserving the original meaning of the diagram.
        - Ensure proper indentation and formatting.
        - If the input is invalid, **generate a new corrected version**.
        - **Do NOT return explanations**—only the corrected Mermaid code.
  
        === START OF ERROR OBJECT ===
        ${error}
        === END OF ERROR OBJECT ===
  
        === START OF MERMAID CODE ===
        ${code}
        === END OF MERMAID CODE ===
  
        **Corrected Mermaid Diagram:**
        \`\`\`mermaid
        (Your corrected code here)
        \`\`\`
    `,
  });

  // Extract only the Mermaid diagram
  const match = text.match(/```mermaid\s*([\s\S]*?)\s*```/);
  return match ? match[1] : text;
};
