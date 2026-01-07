"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./utils/db"));
const socketServer_1 = require("./socketServer");
const app_1 = require("./app");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const isDev = process.env.NODE_ENV !== "production";
// Global fatal error handlers
process.on("uncaughtException", err => console.error("❌ Uncaught Exception:", err));
process.on("unhandledRejection", (reason, p) => console.error("❌ Unhandled Rejection:", reason));
/* ------------------- PROD: CLUSTER MODE ------------------- */
if (!isDev && cluster_1.default.isPrimary) {
    const numCPUs = os_1.default.cpus().length;
    console.log(`🚀 Production mode: Clustering with ${numCPUs} workers`);
    for (let i = 0; i < numCPUs; i++)
        cluster_1.default.fork();
    cluster_1.default.on("exit", (worker) => {
        console.log(`⚠️ Worker ${worker.process.pid} crashed → restarting`);
        cluster_1.default.fork();
    });
}
/* ------------------- DEV OR WORKER PROCESS ------------------- */
else {
    const server = http_1.default.createServer(app_1.app);
    (async () => {
        try {
            // Cloudinary config
            cloudinary_1.v2.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_API_KEY,
                api_secret: process.env.CLOUD_SECRET_KEY,
            });
            // Connect DB first to avoid race conditions
            await (0, db_1.default)();
            console.log("📌 Database connected");
            // Start Socket server only once per worker
            (0, socketServer_1.initSocketServer)(server);
            server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT} (PID: ${process.pid})`));
        }
        catch (error) {
            console.error("❌ Startup Error:", error);
            process.exit(1); // Cluster will restart worker in production
        }
    })();
    server.on("error", (err) => console.error("❌ Server error:", err));
}
