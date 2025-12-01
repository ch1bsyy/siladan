import * as knowledgeBaseModel from "../models/surveysModel.js";

// Get ALL KB
export const index = async (req, res) => {
  try {
    const knowlegdeBase = await knowledgeBaseModel.getAllSurveys();
    res.status(200).json({ status: true, data: knowlegdeBase });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};