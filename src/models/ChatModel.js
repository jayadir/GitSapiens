import mongoose from "mongoose";


const ChatSchema = new mongoose.Schema(
  {
    // sessionId: { type: String, required: true }, 
    userId: { type: String, required: true },
    projectId: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
