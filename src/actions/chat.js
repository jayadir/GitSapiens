"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateSummaryEmbedding } from "../lib/gemini";
import { getPineconeClient } from "../lib/pinecone";
import ProjectFiles from "../models/ProjectFiles";
const model = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askQuestion = async (question, projectId) => {
    console.log(projectId);
  try {
    const stream = createStreamableValue();
    const embedding = await generateSummaryEmbedding(question);
    console.log(embedding);
    const pineconeIndex = await getPineconeClient();
    const res = await pineconeIndex.namespace(projectId).query({
      vector: embedding,
      topK: 7,
      includeValues: true,
      includeMetadata: true,
    });
    console.log(res);
    const filteredResults = res.matches
      .filter((match) => match.score >= 0.5)
      .sort((a, b) => b.score - a.score);
    let context = "";
    const files=[]
    for (const result of filteredResults) {
      const projectFile = await ProjectFiles.findById(result.id);
      files.push(JSON.parse(JSON.stringify(projectFile)));
      context += `name of the file is ${projectFile.fileName}\n and the contents of the file are: ${projectFile.fileContent}\n summary of the code:${projectFile.summary}\n\n`;
    }
    console.log(context);
    (async function () {
      const { textStream } = await streamText({
        model: model("gemini-2.0-flash-exp"),
        prompt: `
                  You are an AI assistant specialized in understanding code repositories. 
                  Your task is to analyze the provided repository files and accurately answer user queries.
          
                  === START OF CONTEXT OBJECT ===
                  The following repository details are provided as context:
          
                  1 **Filenames**: The names of the files in the repository. Use them to locate relevant code sections.
                  2 **Code**: The actual source code within each file. Analyze it to understand the repository's functionality.
                  3 **Summaries**: A brief explanation of what each file does, including its purpose, key functions, and interactions with other files.
          
                  Here is the provided repository context:
          
                  ${JSON.stringify(context, null, 2)}
          
                  === END OF CONTEXT OBJECT ===
          
                  ### **Instructions for Answering:**
                  - **Understand the User's Query:** Determine if the user is asking about a specific file, function, or the repository as a whole.
                  - **Leverage the Provided Context:** Use the filenames to locate files, analyze the code to extract details, and refer to summaries for quick insights.
                  - **Provide Structured & Accurate Responses:** Clearly explain any relevant code, functions, or relationships between files.
                  - **Break Down Complex Code When Necessary:** Simplify technical details while maintaining accuracy.
                  - **Highlight Dependencies:** If a file interacts with others, mention how they work together.
          
                  Now, based on the given repository details, answer the following user query:
          
                  === START OF USER QUERY ===
                  ${question}
                  === END OF USER QUERY ===
              `,
      });
      for await (const text of textStream) {
        stream.update(text);
      }
      stream.done();
    })();
    return { op: stream.value, files: files };
  } catch (error) {

    console.log(error);
  }
};
