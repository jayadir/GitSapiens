import { auth } from "../../../../auth";
import { checkCommitUpdates, fetchUpdatedCommits } from "../../../../lib/github";
export const GET = async (req, { params }) => {
  const { id } = params;
  const session = await auth();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const newCommits = await fetchUpdatedCommits(id);
    return Response.json(
      {
        data: {
          newCommits,
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
