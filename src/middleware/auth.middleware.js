import User from "../model/User.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

const verifyJwt = asyncHandler(async (req, res, next) => {

    try {
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!Token) {
            throw new ErrorHandler(401, "unathorized request!");
        }

        const decoded = await jwt.verify(Token, process.env.ACCES_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if (!user) {
            throw new ErrorHandler(401, "invalid access token");
        }

        req.user = user;

        return next();

    } catch (error) {
        throw new ErrorHandler(500, error?.message || "internal server error!");
    }

})

export { verifyJwt }