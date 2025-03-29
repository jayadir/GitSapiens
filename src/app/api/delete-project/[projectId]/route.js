import { auth } from "../../../../auth";
import Project from "../../../../models/Project";
import UserAndProject from "../../../../models/UserAndProject";
import User from "../../../../models/User";
import Commits from "../../../../models/Commits";
import ProjectFiles from "../../../../models/ProjectFiles";
import { getPineconeClient } from "../../../../lib/pinecone";
import { connect } from "../../../../lib/db";
export const DELETE = async (req, { params }) => {
  const { projectId } = params;
  const session = await auth();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userID = session.user._id;
  try {
    await connect();
    const user = await User.findById(userID);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return Response.json({ message: "Project not found" }, { status: 404 });
    }
    const userAndProject = await UserAndProject.findOne({
      userId: userID,
      projectId: projectId,
    });
    if (!userAndProject) {
      return Response.json(
        { message: "User and project not found" },
        { status: 404 }
      );
    }
    await User.findOneAndUpdate(
      { _id: userID },
      { $pull: { userProjects: userAndProject._id } }
    );
    await UserAndProject.deleteOne({ _id: userAndProject._id });
    await Project.deleteOne({ _id: projectId });
    await Commits.deleteMany({ projectId: projectId });
    await ProjectFiles.deleteMany({ projectId: projectId });
    const pineconeIndex = await getPineconeClient();
    await pineconeIndex.deleteMany({
        filter: { projectId: projectId }, // This removes all vectors related to projectId
      });
      
    return Response.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};
