const path = require("node:path");
const swaggerJsDoc = require("swagger-jsdoc");

module.exports = () => swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Equipment Rental API",
      version: "1.0.0",
      description: "REST API for equipment management and rental requests.",
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js"), path.join(__dirname, "../server.js")],
});
