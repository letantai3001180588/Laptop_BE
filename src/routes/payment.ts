import { Router } from "express";
const { createPayment, VnpayReturn } = require("../controller/payment");

const router = Router();

router.post("/payment", createPayment);
router.get("/vnpay_return", VnpayReturn);

export default router;
