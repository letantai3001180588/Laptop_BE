import express, { Request, Response } from "express";
import connectDB from "./db";
const cors = require("cors");
import routes from "./routes";
import { swaggerUi, swaggerSpec } from "./swagger";
const dotenv = require("dotenv");
const logger = require('../src/utils/logging');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

// Route cơ bản
app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome Laptop Shop Backend!");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.listen(port, (): void => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
