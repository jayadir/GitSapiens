import { Pinecone } from "@pinecone-database/pinecone";

let pinecone;

export async function getPineconeClient() {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
            // environment: process.env.PINECONE_ENVIRONMENT,
        });
        // await pinecone.init();
    }
    const pineconeIndex=pinecone.index("summaries")
    return pineconeIndex;
}
