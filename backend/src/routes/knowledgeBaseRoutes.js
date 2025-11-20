import express from "express";
import * as knowledgeBaseController from "../controllers/knowledgeBaseController.js";

const router = express.Router();

router.get("/", knowledgeBaseController.index);
router.get("/:id", knowledgeBaseController.show);
router.post("/store", knowledgeBaseController.store);
router.put("/update/:id", knowledgeBaseController.update);
router.delete("/delete/:id", knowledgeBaseController.destroy);

export default router;
