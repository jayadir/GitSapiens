import { auth } from "../../../auth";
import Project from "../../../models/Project";
import UserAndProject from "../../../models/UserAndProject";
import mongoose from "mongoose";
export const GET = async (req) => {
  const session = await auth();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const userId = session.user._id;
    const pipeline=[
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "projectDetails",
          },
        },
        { $unwind: "$projectDetails" },
        { $replaceRoot: { newRoot: "$projectDetails" } },
      ]
    const projects = await UserAndProject.aggregate(pipeline);
    return Response.json(
      {
        data: {
          projects,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
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
