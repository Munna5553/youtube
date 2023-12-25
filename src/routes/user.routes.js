import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { upload } from '../middleware/multer.middleware.js'

const router = Router();

router.get("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);

export default router;