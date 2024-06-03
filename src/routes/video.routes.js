import { Router } from "express";
import { publishAVideo } from "../controller/video.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router();

router.post("/upload-video", verifyJwt, publishAVideo);

export default router;