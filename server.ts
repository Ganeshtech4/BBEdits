import { v2 as cloudinary } from "cloudinary";
import http from "http";
import connectDB from "./utils/db";
import { initSocketServer } from "./socketServer";
import { app } from "./app";
import cluster from "cluster";
import os from "os";
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const isDev = process.env.NODE_ENV !== "production";

// Global fatal error handlers
process.on("uncaughtException", err => console.error("❌ Uncaught Exception:", err));
process.on("unhandledRejection", (reason, p) => console.error("❌ Unhandled Rejection:", reason));

/* ------------------- PROD: CLUSTER MODE ------------------- */
if (!isDev && cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`🚀 Production mode: Clustering with ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on("exit", (worker) => {
        console.log(`⚠️ Worker ${worker.process.pid} crashed → restarting`);
        cluster.fork();
    });
}

/* ------------------- DEV OR WORKER PROCESS ------------------- */
else {
    const server = http.createServer(app);

    (async () => {
        try {
            // Cloudinary config
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_API_KEY,
                api_secret: process.env.CLOUD_SECRET_KEY,
            });

            // Connect DB first to avoid race conditions
            await connectDB();
            console.log("📌 Database connected");

            // Start Socket server only once per worker
            initSocketServer(server);

            server.listen(PORT, () =>
                console.log(`🔥 Server running on port ${PORT} (PID: ${process.pid})`)
            );

        } catch (error) {
            console.error("❌ Startup Error:", error);
            process.exit(1); // Cluster will restart worker in production
        }
    })();

    server.on("error", (err) => console.error("❌ Server error:", err));
}
