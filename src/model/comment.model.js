import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            require: true,
        },
        videos: {
            type: mongoose.Types.ObjectId(),
            ref: "Videos"
        },
        owner: {
            type: mongoose.Types.ObjectId(),
            ref: "User"
        }
    },
    {
        timeseries: true
    }
);

commentSchema.plugin(mongooseAggregatePaginate);

const Comment = mongoose.model("comments", commentSchema)