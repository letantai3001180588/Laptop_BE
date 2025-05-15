import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  banner: string[];
  post: string[];
  discount: number;
  star: number;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    image: { type: String },
    banner: { type: [String] },
    post: { type: [String] },
    discount: { type: Number, default: 0 },
    star: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
