import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videFile: {
        publicId: {
            type: String,
            require: true
        },
        videoUrl: {
            type: String,
            require: true
        }
    },
    thumbnail: {
        publicId: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        }
    },
    title: {
        type: String,
        require: true
    },
    description: {
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
        ref: "users"
    },
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model("Videos", videoSchema);

export default Video;