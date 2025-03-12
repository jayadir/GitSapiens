import User from "../../../../models/User";
import {auth} from "../../../../auth"
import { connect } from "../../../../lib/db";
export const GET=async(req,{params})=>{
    const {userId} =await params; 
    const session=await auth();
    if(!session){
        return Response.json({message:"Unauthorized"},{status:401});
    }
    try{
        connect()
        const user=await User.findById(userId);
        return Response.json({
            data:{
                user
            }
        },{status:200});
    }
    catch(error){
        console.log(error);
        return Response.json({
            data:{
                message:error.message
            }
        },{status:500});
    }
}

export const PUT=async (req,{params})=>{
    const {userId} =await params;
    const session=await auth();
    if(!session){
        return Response.json({message:"Unauthorized"},{status:401});
    }
    try{
        connect()
        const newData=await req.json();
        const user=await User.findByIdAndUpdate(userId,newData,{new:true});
        return Response.json({
            data:{
                user
            }
        },{status:200});
    }
    catch(error){
        console.log(error);
        return Response.json({
            data:{
                message:error.message
            }
        },{status:500});
    }
}