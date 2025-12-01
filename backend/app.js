import express from "express";
import "dotenv/config";
import swaggerDocs from "./swagger/docs.js";
import tiketRoutes from "./src/routes/tiketRoutes.js";
import knowledgeBaseRoutes from "./src/routes/knowledgeBaseRoutes.js";
import surveysRoutes from "./src/routes/surveysRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ticket
app.use("/tiket", tiketRoutes);

// Knowledge Base
app.use("/knowledge-base", knowledgeBaseRoutes);

// Surveys
app.use("/surveys", surveysRoutes);

// Swagger
swaggerDocs(app);

export default app;
