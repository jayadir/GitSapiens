"use server"
import Announcement from "../models/AnnouncementModel";
import {connect} from "../lib/db";
import {auth} from "../auth";
export const createAnnouncement = async (data,userId) => {
    const session=await auth()
    if (!session) {
        return {
            data: {
                message: "Unauthorized",
            },
        }
    }
    try {
        data.requiredSkills=data.requiredSkills.split(",").map((skill) => skill.trim())
        await connect();
        const announcement = new Announcement({
            ...data,
            userId: userId,
            // deadline:Date.now()+
        });
        await announcement.save();
        return {
            data: {
                message: "Announcement created successfully",
            },
            status: 200
        };
    } catch (error) {
        console.log(error)
        return {
            data: {
                message: "Error creating announcement",
            },
            status: 500
        };
    }
} 
