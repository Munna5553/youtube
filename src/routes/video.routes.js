import { Router } from "express";
import { getVideoById, publishAVideo } from "../controller/video.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.post("/upload-video", verifyJwt, upload.single("video"), publishAVideo);
router.get("/:videoId", verifyJwt, getVideoById);

export default router;