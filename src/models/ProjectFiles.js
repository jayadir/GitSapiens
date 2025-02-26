import mongoose from "mongoose";
const ProjectFilesSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    fileName: { type: String, required: true },
    fileContent: { type: String, required: true },
    summary: { type: String },
  },
  {
    timestamps: true,
  }
);
const ProjectFiles =
  mongoose.models.ProjectFiles ||
  mongoose.model("ProjectFiles", ProjectFilesSchema);
export default ProjectFiles;
