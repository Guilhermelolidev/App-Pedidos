import express from "express";
import mongoose from "mongoose";
import http from "node:http";
import path from "node:path";
import { Server } from "socket.io";
import { router } from "./router";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://[seu-uri]";
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const app = express();
const server = http.createServer(app);
export const io = new Server(server);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const port = PORT;

    io.on("connection", (socket) => {
      console.log("Novo cliente conectado", socket.id);
    });

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");

      next();
    });
    app.use(
      "/uploads",
      express.static(path.resolve(__dirname, "..", "uploads"))
    );
    app.use(express.json());

    app.use(router);
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(() => console.log("erro ao conectar no mongodb"));
