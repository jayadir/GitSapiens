import { auth } from "../../../../auth";
import Announcement from "../../../../models/AnnouncementModel";
export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return Response.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }
    if (announcement.userId.toString() !== session.user._id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    return Response.json(
      { message: "Announcement fetched successfully", data: announcement },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error while fetching announcement" },
      { status: 500 }
    );
  }
};
