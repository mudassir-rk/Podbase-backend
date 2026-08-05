import { asyncHandler} from "../utils/asyncHandler.js"
const registerUser = asyncHandler(async (req,res,next) =>{
    req.body.username 
    req.body.password
    req.body.email
    if(!req.body.username || !req.body.password ) {
        console.log("username or password is missing")
    }
    res.status(200).json({
    })
})
export {registerUser}