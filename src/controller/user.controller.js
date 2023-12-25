import User from "../model/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {

    const { fullname, username, email, password } = req.body;

    if (!(fullname || username || email || password)) {
        throw new Error("fullname, username, email, and password are required!");
    }

    const existedUser = User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new Error("user already exist!");
    }

    const avatarLocal = req.files?.avatar[0]?.path;
    const coverImageLocal = req.files?.coverImage[0]?.path;

    if (!avatarLocal) {
        throw new Error("avatar image is require!");
    }

    const avatar = await uploadOnCloudinary(avatarLocal)
    const coverImage = await uploadOnCloudinary(coverImageLocal);

    if (avatar) {
        throw new Error("avatar image is unable to upload!");
    }

    const user = await User.create(
        {
            username,
            fullname,
            email,
            avatar: avatar.url,
            coverImage: coverImage?.url
        }
    )

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new Error("something went wrong while creating user!", Error);
    }

    return res.status(200).json(createUser);

}

export { registerUser }