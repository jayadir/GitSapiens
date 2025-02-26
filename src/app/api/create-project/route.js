import Project from "../../../models/Project";
import UserAndProject from "../../../models/UserAndProject";
import { auth } from "../../../auth";
import { connect } from "../../../lib/db";
import { checkCommitUpdates } from "../../../lib/github";
import { indexRepo } from "../../../lib/embeddings";
export const POST = async (req) => {
  const session=await auth()
  if (!session) {
    return {
      status: 401,
      data: { message: "Unauthorized" },
    };
  }
  try {
    await connect();
    const { projectName, repositoryUrl } = await req.json();
    const project = await new Project({
      projectName,
      repositoryUrl,
      accessToken: req?.body?.accessToken,
    }).save();
    const userProject = await new UserAndProject({
      userId: session.user._id,
      projectId: project._id,
    }).save();
    project.userProjects.push(userProject);
    await project.save();
    await indexRepo(project._id, project.repositoryUrl, "main", project.accessToken);
    // const commits=await checkCommitUpdates(project._id);

    return Response.json(
      {
        data: {
          project,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return Response.json(
      {
        data: {
          message: error.message,
        },
      },
      { status: 500 }
    );
  }
};
