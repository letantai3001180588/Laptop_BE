import { Router } from "express";
const { login, register } = require("../controller/auth");

const router = Router();

router.post("/login", login);
router.post("/register", register);

export default router;
