// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa schema cho User
interface IUser extends Document {
  phone: string;
  email: string;
  password: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,  // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model User
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
