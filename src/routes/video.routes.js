import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controller/video.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.post("/publish", verifyJwt, upload.single("video"), publishAVideo);
router.get("video/:videoId", verifyJwt, getVideoById);

router.patch("/update/:videoId", verifyJwt, upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), updateVideo);

router.delete("/delete/:videoId", verifyJwt, deleteVideo);
router.patch("/publish-status/:videoId", verifyJwt, togglePublishStatus);
router.get("/user", verifyJwt, getAllVideos);

export default router;  