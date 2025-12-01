import express from "express";
import * as knowledgeBaseController from "../controllers/surveysController.js";

const router = express.Router();

router.get("/", knowledgeBaseController.index);

export default router;
// test
