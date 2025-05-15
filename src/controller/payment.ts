import { Request, Response } from "express";
import Order from "../model/order";
import moment from "moment";
import crypto from "crypto";
import qs from "qs";

function sortObject(obj: Record<string, any>): Record<string, string> {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(String(obj[key])).replace(
      /%20/g,
      "+"
    );
    sorted[encodedKey] = encodedValue;
  }

  return sorted;
}

module.exports = {
  createPayment: async (req: Request, res: Response) => {
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const {
      products,
      methodPay,
      amount,
      phone,
      address,
      bankCode = "",
    } = req.body;
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("HHmmss");

    try {
      const data = await Order.create({
        products,
        totalAmount: amount,
        methodPay,
        code: orderId,
        phone,
        address,
      });
      if (!data) return res.status(400).json({ message: "Not found" });

      if (methodPay === "VNPAY") {
        const tmnCode = process.env.VNP_TMN_CODE!;
        const secretKey = process.env.VNP_HASH_SECRET!;
        let vnpUrl = process.env.VNP_URL!;
        const returnUrl = process.env.VNP_RETURN_URL!;

        const orderInfo =
          "Thanh toan hoa don #" + orderId + " so tien: " + amount;
        const orderType = "other";
        const locale = "vn";
        const currCode = "VND";

        const vnp_Params: Record<string, string> = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: tmnCode,
          vnp_Locale: locale,
          vnp_CurrCode: currCode,
          vnp_TxnRef: orderId,
          vnp_OrderInfo: orderInfo,
          vnp_OrderType: orderType,
          vnp_Amount: (Number(amount) * 100).toString(),
          vnp_ReturnUrl: returnUrl,
          vnp_IpAddr: String(ipAddr),
          vnp_CreateDate: createDate,
        };

        if (bankCode) vnp_Params["vnp_BankCode"] = String(bankCode);

        const sortedParams = sortObject(vnp_Params);
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(signData, "utf-8").digest("hex");

        sortedParams["vnp_SecureHash"] = signed;
        const paymentUrl =
          vnpUrl + "?" + qs.stringify(sortedParams, { encode: false });

        res.status(200).json({ message: "Successfully", data, paymentUrl });
      }

      return res.status(200).json({ message: "Successfully", data });
    } catch (error) {}
  },
  VnpayReturn: async (req: Request, res: Response) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const secretKey = process.env.VNP_HASH_SECRET!;
    const sortedParams = sortObject(vnp_Params);

    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData, "utf-8").digest("hex");

    if (secureHash === signed) {
      await Order.updateOne(
        { code: vnp_Params.vnp_TxnRef },
        { status: "paid" }
      );

      return res.redirect("http://localhost:8081/notifications");
    } else {
      res.status(400).json({ code: "97", message: "Chữ ký không hợp lệ" });
    }
  },
};
