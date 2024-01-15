import mongoose, { Schema } from "mongoose";


const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Types.ObjectId(),
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);


const Tweet = mongoose.model("tweets", tweetSchema);

export default Tweet