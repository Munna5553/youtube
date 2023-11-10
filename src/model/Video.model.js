import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videFile: {
        type: String,
        require: true
    },
    videFile: {
        type: String,
        require: true
    },
    videFile: {
        type: String,
        require: true
    },
    videFile: {
        type: String,
        require: true
    },
    duration: {
        type: Number,
        require: true
    },
    view: {
        type: Number,
        require: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;