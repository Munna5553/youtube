import User from "../model/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { ResponseHandler } from "../utils/ResponseHandler.js";


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
})

export { registerUser, Login, LogOut }