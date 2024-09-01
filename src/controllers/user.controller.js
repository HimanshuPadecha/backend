import { ApiErrors } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(
    async(req,res)=>{
        
        const {email,password,userName,fullName} = req.body

        if(
            [email,password,userName,fullName].some(item=>item?.trim() === "")
        ){
            throw new ApiErrors(400,"Please fill all the fields")
        }
        
        const existedUser = User.findOne({
            $or:[{userName},{email}]
        })

        if(existedUser){
            throw new ApiErrors(409,"User with name or email already exist")
        }

        const avatarLocalPath = req.files?.avatar[0]?.path
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if(!avatarLocalPath){
            throw new ApiErrors(400,"Avatar is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiErrors(400,"Avatar is required")
        }

        const response = await User.create({
            userName:userName.toLowerCase(),
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            fullName
        })

        const createdUser = await User.findById(response._id).select("-password -refreshToken")

        if(!createdUser){
            throw new ApiErrors(500,"Something went wrong when registering user")
        }

        res.status(200).json(
            new ApiResponse(200,createdUser,"User created successfully")
        )
    }
)

export {registerUser}