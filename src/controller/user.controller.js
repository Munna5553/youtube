import User from "../model/User.model.js";
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { ResponseHandler } from "../utils/ResponseHandler.js";
import mongoose from "mongoose";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ErrorHandler(500, "something went wrong while generating refresh and access token1");
    }
};

const option = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {

    const { fullname, username, email, password } = req.body;

    if (!(fullname && username && email && password)) {
        throw new ErrorHandler(400, "fullname, username, email, and password are required!")
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ErrorHandler(409, "user already exist!")
    }

    let avatarLocal = req.files?.avatar[0]?.path;

    //const coverImageLocal = req.files?.coverImage[0]?.path;
    let coverImageLocal;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenght > 0) {
        coverImageLocal = req.files.coverImage[0].path
    }


    const avatar = await uploadOnCloudinary(avatarLocal)
    const coverImage = await uploadOnCloudinary(coverImageLocal);

    const user = await User.create(
        {
            username,
            email,
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            password,
        }
    )

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new ErrorHandler(500, "something went wrong while creating user!")
    }

    return res.status(201).json(
        new ResponseHandler
            (
                201,
                createUser,
                "user register succcesfully!"
            )
    );


});


const Login = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ErrorHandler(400, "email or username is reuired!");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ErrorHandler(404, "user does not exist!");
    }

    const isPasswordvalid = await user.IsPasswordCorrect(password);

    if (!isPasswordvalid) {
        throw new ErrorHandler(401, "invalid user credential!..");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ResponseHandler
                (
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "user logged in successfully!"
                ),
        )

});


const LogOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ResponseHandler
                (
                    200,
                    {},
                    "user logged out successfully!"
                )
        );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const recievedToken = req.cookie.refreshToken || req.body.refreshToken;

        if (!recievedToken) {
            throw new ErrorHandler(401, "unathorized requist!..");
        }

        const decodedToken = await jwt.verify(
            recievedToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ErrorHandler(401, "invalid refresh token!..")
        }

        if (recievedToken !== user?.refreshToken) {
            throw new ErrorHandler(401, "refresh token is expired!..");
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        return res.status(200)
            .cookie("refreshToken", refreshToken, option)
            .cookie("accessToken", accessToken, option).
            json(
                new ResponseHandler(
                    200,
                    { accessToken, refreshToken },
                    "access token and refreshToken update successfully!.."
                )
            )
    } catch (error) {
        throw new ErrorHandler(401, error?.message);
    }

});


const changePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword === newPassword)) {
        throw new ErrorHandler(401, "old password and new password is required!..");
    }

    const user = await User.findById(req.user?._id);

    const IsPasswordCorrect = await user.IsPasswordCorrect(oldPassword);

    if (!IsPasswordCorrect) {
        throw new ErrorHandler(400, "invalid old password!");
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ResponseHandler(
            200,
            {},
            "password change successfully!"
        )
    )


});

const getUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ResponseHandler(
            200,
            req.user,
            "current user fetched successfully!.."
        )
    )

});


const updateAccountDetail = asyncHandler(async (req, res) => {

    const { fullname, email } = req.body;

    if (!(fullname && email)) {
        throw new ErrorHandler(400, "fullname and email is required to update!..");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ResponseHandler(
            200,
            user,
            "account details updated successfully!.."
        )
    )

});


const updateAvatar = asyncHandler(async (req, res) => {

    const avatarLocal = req.file?.path;

    if (!avatarLocal) {
        throw new ErrorHandler(400, "avatar file is misisng!..");
    }

    const avatar = await uploadOnCloudinary(avatarLocal);

    if (!avatar.url) {
        throw new ErrorHandler(400, "error while uploding avatar!..");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ResponseHandler(
            200,
            user,
            "avatar image updated successfully!.."
        )
    );

});


const updateCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocal = req.file?.path;

    if (!coverImageLocal) {
        throw new ErrorHandler(400, "cover image file is misisng!..");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocal);

    if (!coverImage.url) {
        throw new ErrorHandler(400, "error while uploding cover image!..");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ResponseHandler(
            200,
            user,
            "coverImage image updated successfully!.."
        )
    );

});


const getWatchHistory = asyncHandler(async (res, res) => {
    const user = User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: videos,
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json(
        new ResponseHandler(
            200,
            user[0].watchHistory,
            "watch story fetched succesfully"
        )
    )
})

export {
    registerUser,
    Login,
    LogOut,
    refreshAccessToken,
    changePassword,
    updateAvatar,
    updateCoverImage,
    getUser,
    updateAccountDetail,
    getWatchHistory
};