import mongoose from "mongoose";
import UserAndProject from "./UserAndProject";
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    providerId: { type: String },
    username: { type: String },
    bio: { type: String },
    image: { type: String },
    userProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserAndProject' }]
})
export default mongoose.models.User || mongoose.model('User', schema)