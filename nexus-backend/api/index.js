const serverless = require("serverless-http");
const app = require("../nexus-backend/app");

module.exports = serverless(app);