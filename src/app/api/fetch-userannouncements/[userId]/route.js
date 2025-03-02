import {auth} from "../../../../auth"
import Announcement from "../../../../models/AnnouncementModel"
export const GET=async (req,{params})=>{
    const {userId}=await params;
    const session=await auth();
    if(!session){
        return Response.json({message:"Unauthorized"},{status:401});
    }
    try{
        const announcements=await Announcement.find({userId});
        return Response.json({
            data:{
                announcements
            }
        },{status:200});
    }catch(error){
        console.log(error);
        return Response.json({
            data:{
                message:error.message
            }
        },{status:500});
    }
}