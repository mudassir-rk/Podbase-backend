import mongoose, {Schema} from "mongoose";

const announcementsSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


export const Announcements = mongoose.model("Announcements", announcementsSchema)