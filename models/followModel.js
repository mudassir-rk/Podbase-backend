import mongoose,{Schema} from "mongoose"
const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId, // the one who is following
        ref: "User"
    },
    following: {
        type: Schema.Types.ObjectId, // the one being followed
        ref: "User"
    }
}, {timestamps: true})

export const Follow = mongoose.model("Follow", followSchema)