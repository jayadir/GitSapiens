import mongoose from "mongoose";
const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectUrl: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: [String],
    required: true,
  },
  deadline: {
    type: Date,
    // required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
    default: true,
  },
  applicants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
    default: [],
  },
  Selected: {
    type: Number,
    required: true,
    default: 0,
  },
  requiredNumber: {
    type: Number,
    required: true,
  },
  websiteUrl: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
