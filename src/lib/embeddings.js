import { loadRepo } from "./langchain";
// import { } from "./embeddings";
import { codeSummary, generateSummaryEmbedding } from "./gemini";
import ProjectFiles from "../models/ProjectFiles";
import { getPineconeClient } from "./pinecone";
// import { metadata } from "@/app/layout";
import { GetModels } from "./langchain";
export const indexRepo = async (
  projectId,
  repoUrl,
  branch = "main",
  token = ""
) => {
  const repo = await loadRepo(repoUrl, token, branch);
  const embeddings = await embeddSummary(repo);
  await Promise.allSettled(
    embeddings.map(async (embedding, index) => {
      console.log(`Indexing ${index + 1} ${embedding.value.fileName}`);

      if (!embedding.value.summary) {
        console.log(`Failed to index ${index + 1} ${embedding.value.fileName}, error:${embedding?.error}`);
        return;
      }
      try {
        const projectFile = await ProjectFiles.create({
          projectId,
          fileName: embedding.value.fileName,
          fileContent: embedding.value.sourceCode,
          summary: embedding.value.summary,
        });
        const pineconeIndex = await getPineconeClient();
        await pineconeIndex.namespace(projectId).upsert([
          {
            id: projectFile._id.toString(),
            values: embedding.value.embedding,
            metadata: {
              fileName: embedding.value.fileName,
              summary: embedding.value.summary,
              projectId,
            },
          },
        ]);
      } catch (error) {
        console.log(
          `Failed to index ${index + 1} ${embedding.fileName}`,
          error
        );
      }
    })
  );
};
const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
export const embeddSummary = async (docs) => {
  console.log(docs.length);
  const { geminiModel, groqModel, mistralModel } = await GetModels();
  const models = [geminiModel, groqModel, mistralModel];
  
  const results = [];
  const delayTime = docs.length > 70 ? 1000 : 500
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    
    if (i > 0) {
      await delay(1000);
    }
    
    let model;
    if (i % 3 == 0) {
      model = geminiModel;
    } else if (i % 3 == 1) {
      model = groqModel;
    } else if (i % 3 == 2) {
      model = mistralModel;
    }
    
    console.log(
      `Processing document ${i + 1} with model: ${model?.constructor?.name}`
    );
    
    if (!model) {
      console.error(`No model assigned for index ${i}`);
      results.push({ status: 'rejected', reason: "No model selected" });
      continue;
    }
    
    try {
      const summary = await codeSummary(doc, model);
      const embedding = await generateSummaryEmbedding(summary);
      
      results.push({
        status: 'fulfilled',
        value: {
          summary,
          embedding,
          sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
          fileName: doc.metadata.source,
        }
      });
    } catch (error) {
      results.push({ status: 'rejected', reason: error });
    }
  }
  
  return results;
};