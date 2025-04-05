import {auth} from "../../../../auth"
import Project from "../../../../models/Project"
import User from "../../../../models/User"
import UserAndProject from "../../../../models/UserAndProject"
export const GET=async(req,{params})=>{
    const {id}=params;
    const session=await auth();
    if(!session){
        return Response.json({message:"Unauthorized"},{status:401});
    }
    try{
        const projectExists=await UserAndProject.findOne({userId:session.user._id,projectId:id});
        if(!projectExists){
            return Response.json({message:"Page Not Found"},{status:404});
        }
        const project=await Project.findById(id);
        return Response.json({
            data:{
                project
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