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
    desccription:{
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
export const Shows = mongoose.model("Shows",showsSchema);