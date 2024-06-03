import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js"
import User from "../model/User.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ResponseHandler } from "../utils/ResponseHandler.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import Video from "../model/Video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    try {
        if (!(title && description)) {
            throw new ErrorHandler(400, "title and description of video is required.")
        }

        const LocalVideoFile = req.file?.path;
        if (!LocalVideoFile) {
            throw new ErrorHandler(400, "Video file is required.")
        }

        const uploadedVideo = await uploadOnCloudinary(LocalVideoFile);

        const video = await Video.create({
            title,
            description,
            videFile: {
                publicId: uploadedVideo.public_id,
                videoUrl: uploadedVideo.url
            },
            duration: uploadedVideo.duration
        });

        const isVideoUploaded = await Video.findById(String(video._id));

        if (!isVideoUploaded) {
            throw new ErrorHandler(400, "something went wrong while upload videos, try again")
        }

        return res.status(201).json(
            new ResponseHandler
                (
                    201,
                    { data: isVideoUploaded },
                    "user register succcesfully!"
                )
        );
    } catch (error) {
        throw new ErrorHandler(500, "server is not respond try again.")
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}