import { Router } from "express";
import { LogOut, Login, registerUser } from "../controller/user.controller.js";
import { upload } from '../middleware/multer.middleware.js'
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

export default router;