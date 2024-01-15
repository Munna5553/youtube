import mongoose, { Schema } from "mongoose";


const playListSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        videos: [
            {
                type: mongoose.Types.ObjectId(),
                ref: "Videos"
            }
        ],
        owner: {
            type: mongoose.Types.ObjectId(),
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);


const PlayList = mongoose.model("playlists", playListSchema);

export default PlayList;