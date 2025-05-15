import { Request, Response } from "express";
import Order from "../model/order";

module.exports = {
  getOrder: async (req: Request, res: Response) => {
    const { phone } = req.query;

    try {
      const data = await Order.find({ phone }).populate({
        path: "products.productId",
      });
      if (!data) return res.status(400).json({ message: "Not found" });

      return res.status(200).json({ message: "Successfully", data });
    } catch (error) {}
  },
};
