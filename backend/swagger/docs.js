// swagger/docs.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Siladan API Documentation",
      version: "1.0.0",
      description: "Dokumentasi API untuk backend Siladan",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // lokasi anotasi swagger di file routes
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs tersedia di: http://localhost:3000/api-docs");
};

export default swaggerDocs;
