import mongoose from "mongoose";
// import UserAndProject from "./UserAndProject";
const ProjectSchema=new mongoose.Schema({
    projectName:{type:String, required:true},
    repositoryUrl:{type:String, required:true},
    accessToken:{type:String},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
    userProjects:[{type:mongoose.Schema.Types.ObjectId, ref:'UserAndProject'}]
})
const Project=mongoose.models.Project||mongoose.model('Project',ProjectSchema)
export default Project