import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  userId: string;
  licenseId: string;
  socket?: any; // اضافه کردن ویژگی socket
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  licenseId: { type: String, required: true },
  socket: { type: Schema.Types.Mixed }, // اضافه کردن ویژگی socket به اسکیما
});

export const User = mongoose.model<IUser>('User', UserSchema);
