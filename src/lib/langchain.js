import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";

export const loadRepo = async (url, token='',branch="main") => {
    if (!url || typeof url !== 'string') {
        throw new Error("Invalid repository URL provided.");
    }

    if (!token || typeof token !== 'string') {
        console.warn("GitHub access token is missing or invalid. API rate limits may apply.");
    }

    const loader = new GithubRepoLoader(url, {
        accessToken: token ,
        branch,
        recursive: true,
        ignoreFiles: [".gitignore", ".gitattributes", "LICENSE",".png",".ico",".jpg",".jpeg",".svg"],
        maxConcurrency: 2
    });

    try {
        return await loader.load();
    } catch (error) {
        console.error("Error loading repository:", error);
        throw error;
    }
};

export const GetModels = async () => {
    const geminiModel= new ChatGoogleGenerativeAI({
        modelName:'gemini-2.0-flash-lite'
    });
    const groqModel = new ChatGroq({
        model:"llama-3.1-8b-instant"
    });
    const mistralModel=new ChatMistralAI({
        apiKey: process.env.MISTRAL_API_KEY,
        modelName: "mistral-small-latest",
      });
    return {geminiModel,groqModel,mistralModel};
}