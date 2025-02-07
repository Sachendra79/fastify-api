"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const user_js_1 = require("./routes/user.js");
const databse_js_1 = require("./config/databse.js");
require("dotenv").config();
const fastify = (0, fastify_1.default)({ logger: true });
// Connect to database
(0, databse_js_1.default)();
// registering routes
fastify.register(user_js_1.default, { prefix: "/api/auth" });
// Start server
const PORT = process.env.PORT || 5000;
fastify.listen({ port: Number(PORT), host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
    console.log(`Server running on ${address}`);
});
