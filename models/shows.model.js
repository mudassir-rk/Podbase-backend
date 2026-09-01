import mongoose,{Schema} from "mongoose"

const showsSchema = new Schema(
{
    owner:{
        type :Schema.Types.ObjectId,
        ref:"User"
    },
    title :{
        type: String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
    },
},
    {
        timestamps:true
})
export const Show = mongoose.model("Show",showsSchema);