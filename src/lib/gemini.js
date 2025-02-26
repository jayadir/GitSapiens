import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";
import { GetModels } from "./langchain";
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateSummary = async (text) => {
  const response = await model.generateContent(`
        You are a commit summarization assistant. Your task is to analyze the provided Git diff text and produce a clear, concise summary of the changes made in the commit. Follow these steps:

        1. **Read and Analyze the Diff:**  
           - Identify added lines (prefixed with "+"), removed lines (prefixed with "-"), and context lines.
           - Recognize the sections (e.g., functions, components, or files) affected by the changes.

        2. **Determine the Nature of the Changes:**  
           - **Bug Fix:** Does the diff correct an error in logic or functionality?
           - **Feature Update/Enhancement:** Does it introduce new functionality or improve existing features?
           - **Refactoring/Code Cleanup:** Does it simplify or reorganize the code without changing its behavior?

        3. **Create a Concise Summary:**  
           - Summarize the change in plain language.
           - Clearly state what was modified, fixed, or enhanced and where the changes occurred.
           - Briefly mention the potential impact of the change if applicable.

        4. **Format Your Summary:**  
           - Use clear and simple language.
           - Avoid excessive technical jargon to ensure the summary is understandable.
           - If multiple changes exist in a single commit, try to merge them into one coherent summary.

        ---
        
        **Example:**
        
        *Input Diff:*
        \`\`\`diff
        diff --git a/src/utils/helpers.js b/src/utils/helpers.js
        index 2d5f4a8..3b4f5ac 100644
        --- a/src/utils/helpers.js
        +++ b/src/utils/helpers.js
        @@ function calculateSum(a, b) {
        -  return a - b;
        +  return a + b;
        }
        \`\`\`
        
        *Expected Summary:*  
        "This commit fixes a bug in the \`calculateSum\` function by replacing a subtraction operation with an addition, ensuring that the function correctly computes the sum of two numbers."
        
        ---
        
        Now, summarize the following Git diff text:  
        
        \`\`\`diff
        ${text}
        \`\`\`
    `);

  return response.response.text();
};

export const codeSummary = async (doc,model) => {
  console.log(doc);
  try {
    const prompt = `
         You are a Senior Software Engineer reviewing code. Summarize what the given code does in 100 words or fewer. 
         Focus only on its purpose, key functions, and overall logic. Avoid unnecessary details or explanations. 
         
         File Name: ${doc.metadata.source}
         
         Content:
         ${doc.pageContent}
         
         Provide only the summary without any additional comments.
         `;
    console.log(prompt);
    const res = await model.invoke(prompt);
    return res.content;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const generateSummaryEmbedding = async (text) => {
  const model = genai.getGenerativeModel({ model: "text-embedding-004" });
  const res = await model.embedContent(text);
  return res.embedding.values;
};
