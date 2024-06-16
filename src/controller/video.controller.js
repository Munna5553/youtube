import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js"
import User from "../model/User.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ResponseHandler } from "../utils/ResponseHandler.js";
import jwt from "jsonwebtoken"
import mongoose, { isValidObjectId, ObjectId } from "mongoose";
import Video from "../model/Video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    try {
        const { page, limit, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

        if (!(page && userId && limit)) {
            throw new ErrorHandler(400, "page, user id and limit is required.")
        }

        const videos = await Video.find({ owner: userId })
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!videos) {
            throw new ErrorHandler(400, "unable to get all videos.")
        }

        return res.status(200).json(
            new ResponseHandler(
                200,
                videos,
                "Videos fetched successfully"
            )
        );
    } catch (error) {
        throw new ErrorHandler(500, "server is busy, unbale to get all videos.")
    }

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    try {
        const { title, description } = req.body
        if (!(title && description)) {
            throw new ErrorHandler(400, "title and description of video is required.")
        }

        const LocalVideoFile = req.file?.path;
        if (!LocalVideoFile) {
            throw new ErrorHandler(400, "Video file is required.")
        }

        const uploadedVideo = await uploadOnCloudinary(LocalVideoFile, "video");

        const video = await Video.create({
            title,
            description,
            videFile: {
                publicId: uploadedVideo?.public_id,
                videoUrl: uploadedVideo?.url
            },
            duration: uploadedVideo?.duration,
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
        console.log("server busy, upload video again.");
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    try {
        const { videoId } = req.params;
        console.log(videoId);
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
    const { videoId } = req.params;

    const { title, description } = req.body;
    const LocalThumbnail = req.files.thumbnail[0].path;
    const LocalVideo = req.files.video[0].path;

    if (!(title || description || LocalThumbnail || LocalVideo)) {
        throw new ErrorHandler(400, "please provide newer data.")
    }

    const olderVideo = await Video.findById(videoId);
    if (LocalThumbnail) {
        await deleteFromCloudinary(olderVideo.thumbnail?.publicId, "image");
    }

    if (LocalVideo) {
        await deleteFromCloudinary(olderVideo.videFile?.publicId, "video");
    }

    const thumbnailImg = await uploadOnCloudinary(LocalThumbnail, "image")
    const newerVideo = await uploadOnCloudinary(LocalVideo, "video");

    const vidoe = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: {
                    publicId: thumbnailImg.public_id,
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
})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    try {
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
    } catch (error) {
        console.log("server is not responding", error);
    }
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