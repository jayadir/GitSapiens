import {auth} from "../../../../auth"
import Project from "../../../../models/Project"
export const GET=async(req,{params})=>{
    const {id}=params;
    const session=await auth();
    if(!session){
        return Response.json({message:"Unauthorized"},{status:401});
    }
    try{
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