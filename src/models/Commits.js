import mongoose from "mongoose";
const commitSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sha: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  authorAvatar: {
    type: String,
    required: true,
  },
  aiSummary: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Commit || mongoose.model("Commit", commitSchema);