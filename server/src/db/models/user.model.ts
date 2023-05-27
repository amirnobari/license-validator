import mongoose, { Schema, Document } from 'mongoose'
import { License } from './license.model'

export interface IUser extends Document {
  username: string
}

export const UserSchema: Schema = new Schema({
  username: { type: String, unique: true },
})

export const User = mongoose.model<IUser>('User', UserSchema)
