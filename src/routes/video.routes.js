import { Router } from "express";
import { deleteVideo, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controller/video.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.post("/publish", verifyJwt, upload.single("video"), publishAVideo);
router.get("/:videoId", verifyJwt, getVideoById);
router.patch("/update/:videoId", verifyJwt, updateVideo);
router.delete("/delete/:videoId", verifyJwt, deleteVideo);
router.patch("/publish-status/:videoId", verifyJwt, togglePublishStatus);
router.get("/:userId", verifyJwt, getVideoById);

export default router;