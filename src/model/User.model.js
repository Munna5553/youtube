import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        require: true,
        index: true,
        trim: true,
    },
    avatar: {
        type: String,
        require: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password: {
        type: String,
        require: [true, "password is required"]
    },
    refreshToken: {
        type: String
    },
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next()
});

userSchema.methods.IsPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.ACCES_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);

export default User;