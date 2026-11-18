const fs = require("node:fs");
const path = require("node:path");

// Vercel serves static files from public rather than express.static middleware.
const output = path.join(__dirname, "../public/api-docs");
const swaggerPackage = require.resolve("swagger-ui-dist/package.json", {
  paths: [path.dirname(require.resolve("swagger-ui-express"))],
});
const assets = path.dirname(swaggerPackage);
fs.mkdirSync(output, { recursive: true });
for (const file of ["swagger-ui.css", "swagger-ui-bundle.js", "swagger-ui-standalone-preset.js", "favicon-16x16.png", "favicon-32x32.png"]) {
  fs.copyFileSync(path.join(assets, file), path.join(output, file));
}
fs.writeFileSync(path.join(output, "openapi.json"), JSON.stringify(require("../config/swagger")()));
console.log("Prepared Swagger assets and OpenAPI specification in public/api-docs.");
