import { FastifyInstance } from "fastify";
import { signup, login } from "../Controllers/Auth.js";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signup);
  fastify.post("/login", login);
}
