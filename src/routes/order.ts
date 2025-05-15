import { Router } from "express";
const { getOrder } = require("../controller/order");

const router = Router();

router.get("/order", getOrder);

export default router;
