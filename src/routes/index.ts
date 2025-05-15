// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth";
import paymentRoutes from "./payment";
import productRoutes from "./product";
import orderRoutes from "./order";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", paymentRoutes);
router.use("/", productRoutes);
router.use("/", orderRoutes);


export default router;
