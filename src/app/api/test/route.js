import {
  checkCommitUpdates,
  octokit,
  getCommits,
  summarize,
  fetchUserSkills
} from "../../../lib/github";
import {
  generateSummary,
  codeSummary,
  generateSummaryEmbedding,
} from "../../../lib/gemini";

import { loadRepo } from "../../../lib/langchain";
import { GetModels } from "../../../lib/langchain";
export const GET = async (req) => {
  try {
    // const res = await fetchUserSkills("https://github.com/jayadir")
    // console.log(res);
//     const { geminiModel, groqModel, mistralModel } = await GetModels();
//     const mistralCode = `
// import { MistralAIEmbeddings } from "@langchain/mistralai";

// const embeddings = new MistralAIEmbeddings({
//   apiKey: process.env.MISTRAL_API_KEY,
// });
// const res = await embeddings.embedQuery("Hello world");
// `;

//     console.log(
//       await geminiModel.invoke(
//         `Summarize this code:\n\`\`\`javascript\n${mistralCode}\n\`\`\``
//       )
//     );
//     console.log(await groqModel.invoke(
//       `Summarize this code:\n\`\`\`javascript\n${mistralCode}\n\`\`\``
//     ));
//     console.log(await mistralModel.invoke(
//       `Summarize this code:\n\`\`\`javascript\n${mistralCode}\n\`\`\``
//     ));
    // console.log(await generateSummaryEmbedding("This commit fixes a bug in the `calculateSum` function by replacing a subtraction operation with an addition, ensuring that the function correctly computes the sum of two numbers."));

    const res=await loadRepo("https://github.com/excalidraw/excalidraw",process.env.GITHUB_PAT,"master");
    console.log(res.length)
    // summarize("https://github.com/excalidraw/excalidraw","9ee0b8ffcbd3664a47748a93262860321a203821").then((res)=>{
    //     console.log(res);
    // });

    // generateSummary(diffText).then((res)=>{
    //     console.log(res);
    // });
    return Response.json({ message: res }, { status: 200 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
