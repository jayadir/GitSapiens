"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateSummaryEmbedding } from "../lib/gemini";
import { getPineconeClient } from "../lib/pinecone";
import Chat from "../models/ChatModel";
import ProjectFiles from "../models/ProjectFiles";
import { connect } from "../lib/db";
const model = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askQuestion = async (question, projectId, attachments = []) => {
  console.log(projectId);
  try {
    await connect();
    let chat = await Chat.findOne({ projectId });
    if (!chat) {
      chat = new Chat({ projectId, messages: [] });
    }
    chat.messages.push({ role: "user", content: question });

    const stream = createStreamableValue();
    let issues = "";
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        issues += `issue title is ${attachment.title} and the issue body is ${attachment.body}\n\n`;
      }
    }
    const embedding =
      issues === ""
        ? await generateSummaryEmbedding(question)
        : await generateSummaryEmbedding(question + issues);
    console.log(embedding);
    const pineconeIndex = await getPineconeClient();
    const res = await pineconeIndex.namespace(projectId).query({
      vector: embedding,
      topK: 7,
      includeValues: true,
      includeMetadata: true,
    });
    console.log(res);
    let filteredResults = res.matches
      .filter((match) => match.score >= 0.25)
      .sort((a, b) => b.score - a.score);
    if (filteredResults.length === 0) {
      filteredResults = res.matches
        .filter((match) => match.score >= 0.2)
        .sort((a, b) => b.score - a.score);
    }
    if (filteredResults.length === 0) {
      filteredResults = res.matches
        .filter((match) => match.score >= 0.15)
        .sort((a, b) => b.score - a.score);
    }

    let context = "";
    const files = [];
    for (const result of filteredResults) {
      const projectFile = await ProjectFiles.findById(result.id);
      files.push(JSON.parse(JSON.stringify(projectFile)));
      context += `name of the file is ${projectFile.fileName}\n and the contents of the file are: ${projectFile.fileContent}\n summary of the code:${projectFile.summary}\n\n`;
    }
    console.log(context);
    (async function () {
      const { textStream } = await streamText({
        model: model("gemini-2.0-flash-exp"),
        prompt:
          attachments.length === 0
            ? `
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
                  === PREVIOUS CHAT HISTORY ===
                  ${JSON.stringify(chat.messages.slice(-5), null, 2)}
                  === END OF PREVIOUS CHAT HISTORY ===
                  === START OF USER QUERY ===
                  ${question}
                  === END OF USER QUERY ===
              `
            : `
              You are an AI assistant specialized in understanding code repositories. 
              Your task is to analyze the provided repository files and accurately answer user queries, 
              while also considering relevant GitHub issues to provide more context.
            
              === START OF CONTEXT OBJECT ===
              The following repository details are provided as context:
            
              1. **Filenames**: The names of the files in the repository. Use them to locate relevant code sections.
              2. **Code**: The actual source code within each file. Analyze it to understand the repository's functionality.
              3. **Summaries**: A brief explanation of what each file does, including its purpose, key functions, and interactions with other files.
            
              Here is the provided repository context:
            
              ${JSON.stringify(context, null, 2)}
            
              === END OF CONTEXT OBJECT ===
            
              === START OF GITHUB ISSUES ===
              The user has also provided related GitHub issues for reference. These issues describe real-world problems, bugs, or feature requests related to the repository.
              
              ${JSON.stringify(issues, null, 2)}
            
              === END OF GITHUB ISSUES ===
            
              ### **Instructions for Answering:**
              - **Understand the User's Query:** Determine if the user is asking about a specific file, function, or the repository as a whole.
              - **Leverage the Provided Context:** Use filenames, code, and summaries to extract details and address the question.
              - **Analyze Related GitHub Issues:** If the query is related to a reported issue, determine if the problem is already addressed in the repository.
              - **Provide Structured & Accurate Responses:** Clearly explain any relevant code, functions, or file relationships.
              - **Break Down Complex Code When Necessary:** Simplify technical details while maintaining accuracy.
              - **Highlight Dependencies & Issue Resolutions:** If an issue is related to a function or module, mention how they work together and suggest possible fixes.
            
              Now, based on the given repository details and GitHub issues, answer the following user query:
               === PREVIOUS CHAT HISTORY ===
              ${JSON.stringify(chat.messages.slice(-5), null, 2)}
              === END OF PREVIOUS CHAT HISTORY ===
              === START OF USER QUERY ===
              ${question}
              === END OF USER QUERY ===
            `,
      });
      let botResponse = "";
      for await (const text of textStream) {
        stream.update(text);
        botResponse += text;
      }
      stream.done();
      chat.messages.push({
        role: "assistant",
        content: botResponse,
      });
      await chat.save();
    })();
    return { op: stream.value, files: files };
  } catch (error) {
    console.log(error);
  }
};
