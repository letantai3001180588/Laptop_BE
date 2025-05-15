import mongoose, { Schema, Document } from "mongoose";

interface IProduct {
  productId: mongoose.Types.ObjectId;
  quantity: Number;
}

interface IOrder extends Document {
  code: String;
  methodPay: String;
  products: IProduct[];
  totalAmount: Number;
  status: String;
  paymentStatus: String;
  address: String;
  phone: String;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    code: String,
    methodPay: String,
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    totalAmount: Number,
    address: String,
    phone: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ code: 1 });
const Product = mongoose.model<IOrder>("Order", OrderSchema);

export default Product;
