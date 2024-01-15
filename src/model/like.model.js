import mongoose, { Schema } from "mongoose";


const likeSchema = new Schema(
    {
        videos: {
            type: mongoose.Types.ObjectId(),
            ref: "videos"
        },
        Comment: {
            type: mongoose.Types.ObjectId(),
            ref: "Comment"
        },
        tweet: {
            type: mongoose.Types.ObjectId(),
            ref: "Tweet"
        },
        likedby: {
            type: mongoose.Types.ObjectId(),
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Like = mongoose.model("likes", likeSchema);

export default Like;