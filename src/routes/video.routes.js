import { Router } from "express";
import { publishAVideo } from "../controller/video.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.post("/upload-video", verifyJwt, upload.single("video"), publishAVideo);

export default router;