"use server";
import Announcement from "../models/AnnouncementModel";
import { connect } from "../lib/db";
import { auth } from "../auth";
import { generateSummaryEmbedding } from "../lib/gemini";
import { getPineconeClient } from "../lib/pinecone";
export const createAnnouncement = async (data, userId) => {
  const session = await auth();
  if (!session) {
    return {
      data: {
        message: "Unauthorized",
      },
    };
  }
  try {
    data.requiredSkills = data.requiredSkills
      .split(",")
      .map((skill) => skill.trim());
    await connect();
    const announcement = new Announcement({
      ...data,
      userId: userId,
      // deadline:Date.now()+
    });

    await announcement.save();
    const pineconeIndex = await getPineconeClient();
    const embedding = await generateSummaryEmbedding(
      JSON.stringify({
        description: data.description,
        skills: data.requiredSkills,
      })
    );
    try {
      await pineconeIndex.namespace("announcements").upsert([
        {
          id: announcement._id.toString(),
          values: embedding,
          metadata: {
            description: data.description,
            skills: data.requiredSkills,
            userId: userId,
          },
        },
      ]);
    } catch (error) {
      console.log("Failed to index announcement", error);
    }
    return {
      data: {
        message: "Announcement created successfully",
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      data: {
        message: "Error creating announcement",
      },
      status: 500,
    };
  }
};
