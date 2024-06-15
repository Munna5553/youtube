import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js"
import User from "../model/User.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ResponseHandler } from "../utils/ResponseHandler.js";
import jwt from "jsonwebtoken"
import mongoose, { isValidObjectId } from "mongoose";
import Video from "../model/Video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    try {
        const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

        const videos = await Video.find()
            .sort(sortType)
            .skip((page - 1) * limit)
            .limit(Number(limit))

        return res.statu(200).json(
            new ResponseHandler(
                "Videos fetched successfully",
                videos,
                200
            )
        )

    } catch (error) {
        throw new ErrorHandler(400, "server is busy, try again.");
    }

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
            duration: uploadedVideo.duration,
            owner: req.user?._id
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
                    "video uploaded successfully."
                )
        );
    } catch (error) {
        throw new ErrorHandler(500, "server is not respond try again.")
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ErrorHandler(400, "video id is not exists");
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ErrorHandler(400, "video is not found");
        }

        return res.status(200).json(
            new ResponseHandler(
                200,
                { data: video },
                "video founded successfully!"
            )
        );

    } catch (error) {
        throw new ErrorHandler(500, "server is not responding, try again.")
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    try {
        const { videoId } = req.params;

        const { title, description } = req.body;
        const { thumbnail, video } = req.file;

        if (!(title || description || thumbnail)) {
            throw new ErrorHandler(400, "please provide newer data.")
        }

        const thumbnailImg = await uploadOnCloudinary(thumbnail)

        if (video) {
            const olderVideo = await Video.findById(videoId);
            await deleteFromCloudinary(olderVideo.videFile?.publicId, "video");
        }
        const newerVideo = await uploadOnCloudinary(video)

        const vidoe = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description,
                    thumbnail: {
                        public_id: thumbnailImg.public_id,
                        url: thumbnailImg.url
                    },
                    videFile: {
                        publicId: newerVideo.public_id,
                        videoUrl: newerVideo.url
                    }
                }
            },
            { new: true }
        );

        res.status(200).json(
            new ResponseHandler(
                200,
                { data: vidoe },
                "video updated successfully!"
            )
        )

    } catch (error) {
        throw new ErrorHandler(500, "server is not responding, try again.")
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ErrorHandler(400, "invalide video id.")
    }

    const video = await Video.findByIdAndDelete(videoId);
    await deleteFromCloudinary(video.videFile?.publicId, "video");

    return res.status(200).json(
        new ResponseHandler(
            200,
            {},
            "video deleted successfully 👍"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            throw new ErrorHandler(400, "unable to find video id, please provide.")
        }

        const video = await Video.findByIdAndUpdate(
            videoId,
            { $set: { isPublished: !req.body.isPublished } },
            { new: true }
        )

        return res.status(200).json(
            new ResponseHandler(
                200,
                { data: video },
                `video ${req.body.isPublished ? "published" : "unpublished"} successfully!`,
            )
        )
    } catch (error) {
        throw new ErrorHandler(500, "server is not responding, while changing publish status")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}