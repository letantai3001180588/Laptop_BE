import { Request, Response } from "express";
import Product from "../model/product";

module.exports = {
  insertProduct: async (req: Request, res: Response) => {
    try {
      const product = await Product.insertMany(req.body);
      if (!product) return res.status(400).json({ message: "Not found" });

      return res.status(200).json({ message: "Successful", product });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  createProduct: async (req: Request, res: Response) => {
    try {
      const product = await Product.create(req.body);
      if (!product) return res.status(400).json({ message: "Not found" });

      return res.status(200).json({ message: "Successful", product });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  getProduct: async (req: Request, res: Response) => {
    const { name, minPrice, maxPrice } = req.query;
    const query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    try {
      const product = await Product.find(query);
      if (!product) return res.status(400).json({ message: "Not found" });

      return res.status(201).json({ message: "Successfully", product });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  detailProduct: async (req: Request, res: Response) => {
    const { _id } = req.params;

    try {
      const product = await Product.findOne({ _id });
      if (!product) return res.status(400).json({ message: "Not found" });

      return res.status(201).json({ message: "Successfully", product });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  putProduct: async (req: Request, res: Response) => {
    const { _id } = req.params;

    try {
      const product = await Product.updateOne({ _id });
      if (!product) return res.status(400).json({ message: "Not found" });

      return res.status(200).json({ message: "Successful", product });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
      const product = await Product.deleteOne({ _id });
      if (!product) return res.status(400).json({ message: "Not found" });

      return res.status(200).json({ message: "Successful" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
