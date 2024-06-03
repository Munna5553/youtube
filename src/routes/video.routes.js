import { Router } from "express";
import { publishAVideo } from "../controller/video.controller";
import { verifyJwt } from "../middleware/auth.middleware";


const router = Router();

router.post("/upload-video", verifyJwt, publishAVideo);

export default router;