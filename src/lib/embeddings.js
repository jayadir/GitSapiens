import { loadRepo } from "./langchain";
// import { } from "./embeddings";
import { codeSummary,generateSummaryEmbedding  } from "./gemini";
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
        console.log(`Failed to index ${index + 1} ${embedding.value.fileName}`);
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
        console.log(`Failed to index ${index + 1} ${embedding.fileName}`, error);
      }
    })
  );
};
const delay=(time)=>{
  return new Promise((resolve)=>{
    setTimeout(resolve,time);
  });
}
export const embeddSummary = async (docs) => {
  const { geminiModel, groqModel, mistralModel } = await GetModels();
  const models=[geminiModel,groqModel,mistralModel];
  return await Promise.allSettled(
    docs.map(async (doc) => {
      await delay(500)
      const model=models[Math.floor(Math.random()*models.length)];
      const summary = await codeSummary(doc,model);
      const embedding = await generateSummaryEmbedding(summary);
      console.log(doc.metadata.source);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    })
  );
};
