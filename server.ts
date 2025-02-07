import Fastify from "fastify";

import authRoutes from "./routes/user.js";
import connectDB from "./config/databse.js";

require("dotenv").config();


const fastify = Fastify({ logger: true });

// Connect to database
connectDB();

// registering routes
fastify.register(authRoutes, { prefix: "/api/auth" });

// Start server
const PORT = process.env.PORT || 5000;
fastify.listen({ port: Number(PORT), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});
