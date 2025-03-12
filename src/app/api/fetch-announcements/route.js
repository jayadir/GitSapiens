import {auth} from "../../../auth"
import Announcement from "../../../models/AnnouncementModel"
export const GET=async (req)=>{
    const session=await auth();
    if(!session){
        return Response.json({message:"Unauthorized"},{status:401});
    }
    const userId=session.user._id;
    try{
        // const announcements=await Announcement.find({ userId: { $ne: userId } });
        const announcements=await Announcement.find();
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