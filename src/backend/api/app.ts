import Fastify from "fastify";
import cors from "@fastify/cors";
import { participantRoutes } from "./participants";

export const app = Fastify();

app.register(cors);
app.register(participantRoutes);
