import mongoose from "mongoose";
const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    projectId:{type:mongoose.Schema.Types.ObjectId, ref:'Project', required:true},
})
export default mongoose.models.UserAndProject || mongoose.model('UserAndProject', schema)