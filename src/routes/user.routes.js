import { Router } from "express";
import { LogOut, Login, changePassword, getUser, getWatchHistory, refreshAccessToken, registerUser, updateAccountDetail, updateAvatar, updateCoverImage } from "../controller/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router();

router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);

router.post("/login", Login);

router.post("/logout", verifyJwt, LogOut);

router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changePassword);
router.get("/current-user", verifyJwt, getUser);
router.patch("/update-details", verifyJwt, updateAccountDetail);
router.patch("/update-avatar", verifyJwt, upload.single("avatar"), updateAvatar);
router.patch("/update-coverImage", verifyJwt, upload.single("coverImage"), updateCoverImage);

router.get("/history", verifyJwt, getWatchHistory);

export default router;