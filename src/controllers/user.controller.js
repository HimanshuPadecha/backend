import { ApiErrors } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(
    async (req,res)=>{
        //check validation
        //check if user already exist
        //add middleware to upload the avatar and coverImage in localstorage 
        //check if its uploaded in local server=>avatar
        //upload them in cloudinary
        //check if they are uploaded in cloudinary
        //make a object and do a dataentry
        //check if user is added in database
        //if user added successfully then give a response without password and token


        const [email,fullName,userName,password] = req.body

        if(
            [email,password,fullName,userName].some(item=>item?.trim() === "")
        ){
            throw new ApiErrors(400,"All fields are neccessary to sign up")
        }

        const userAlreadyExist = await User.findOne(
            {
                $or:[{email,userName}]
            }
        )

        if(userAlreadyExist){
            throw new ApiErrors(404,"User with this email or username already exist")
        }

        const avatarLoacalPath = req.files?.avatar[0].path
        const coverImageLocalPath = req.files?.coverImage[0].path

        if(!avatarLoacalPath){
            throw new ApiErrors(404,"Avatar is required")
        }

        const avatar = await uploadOnCloudinary(avatarLoacalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiErrors(500,"Internal server error")
        }

        const response = await User.create({
            email,
            password,
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            userName:userName.toLowerCase()
        })

        const user = await User.findById(response._id).select("-password -refreshToken")

        if(!user){
            throw new ApiErrors(505,"Something went wrong when creating a user")
        }

        res.status(200).json(
            new ApiResponse(200,user,"User is successfully registered!")
        )
    }
)

export {registerUser}