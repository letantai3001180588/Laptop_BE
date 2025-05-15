import { Router } from "express";
const {
  createProduct,
  detailProduct,
  getProduct,
  putProduct,
  deleteProduct,
  insertProduct,
} = require("../controller/product");

const router = Router();

router.post("/product", createProduct);
router.post("/products", insertProduct);
router.put("/product/:_id", putProduct);
router.delete("/product/:_id", deleteProduct);
router.get("/product", getProduct);
router.get("/product/:_id", detailProduct);

export default router;
