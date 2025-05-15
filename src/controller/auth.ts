import { Request, Response } from "express";
import User from "../model/user";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).lean();
      if (!user) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || "",
        { expiresIn: process.env.EXPIRES_IN }
      );

      return res
        .status(200)
        .json({
          message: "Login successful",
          token,
          user: { email: user.email, phone: user.phone },
        });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  register: async (req: Request, res: Response) => {
    const { email, password, phone } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        phone,
      });

      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  },
};
