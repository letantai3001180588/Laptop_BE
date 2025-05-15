// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "A simple Express API for managing users",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}/docs`,
      },
    ],
  },
  apis: ["./routes/*.ts", "./controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
