import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiErrors} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const {channelName} = req.params

    if(!channelName){
        throw new ApiErrors(404,"send channel name")
    }

    const channelInfo = await Video.aggregate([])
})

const getChannelVideosGlobal = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {channelName} = req.params

    if(!channelName){
        throw new ApiErrors(404,"provide channel name")
    }

    const user = await User.findOne({channelName})

    if(!user){
        throw new ApiErrors(404,"channel not found")
    }

    const videos = await Video.aggregate([
        {
            $match:{
                owner:mongoose.Types.ObjectId(user._id),
                isPublished:true
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"liked"
            }
        },
        {
            $addFields:{
                owner:{
                    channelName
                },
                likes:{
                    $size:"$liked"
                }
            }
        },
    ])
   
    if(videos.length === 0){
        throw new ApiErrors(404,"This user have not uploaded any videos yet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,videos,"videos of the provided channel is fetched successfully"))

})


const getChannelVideosOur = asyncHandler(async(req,res)=>{
        //fetch our total uploaded videos

        const videos = await Video.aggregate([
            {
                $match:{owner:user?._id}
            },
            {
                $lookup:{
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"liked"
                }
            },
            {
                $addFields:{
                    likes:{
                        $size:"$liked"
                    },
                    owner:user.userName
                }
            }
        ])

        return res
        .status(200)
        .json(new ApiResponse(200,videos,"Your channels videos found successfully"))
})


export {
    getChannelStats, 
    getChannelVideosGlobal,
    getChannelVideosOur
    }