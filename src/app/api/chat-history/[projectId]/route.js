import {auth} from "../../../../auth"
import Chat from "../../../../models/ChatModel"
import {connect} from "../../../../lib/db"
export const GET=async(requestAnimationFrame,{params})=>{
    const {projectId}=params
    const session=await auth()
    if(!session?.user?.email){
        return Response.json(
            {data:{message:"Unauthorized"}},
            {status:401}
        )
    }
    try {
        await connect()
        const history=await Chat.findOne({projectId,userId:session?.user._id})
        if(!history){
            return Response.json(
                {data:{message:"No chat history found"}},
                {status:200}
            )
        }
        const messages=history.messages.map((message)=>{
            return {
                role:message.role,
                content:message.content,
            }
        })
        return Response.json(
            {data:{messages}},
            {status:200}
        )
    } catch (error) {
        console.log(error)
        return Response.json(
            {data:{message:"Internal server error while fetching chat history"}},
            {status:500}
        )
    }
}