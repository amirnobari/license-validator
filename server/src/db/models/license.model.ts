import mongoose, { Schema, Document } from 'mongoose'
import { licenseStatusEnum } from '../../enums/license.enum'
import { DetailsTamePriceLicense } from '../models/details-tame-price-license.model'
import { UserSchema } from './user.model'
export interface ILicense extends Document {
  userId: typeof UserSchema
  licenseId: string
  startedAt: Date
  expiredAt: Date
  status: licenseStatusEnum
  detailsTimePriceLicense: typeof DetailsTamePriceLicense
}

const LicenseSchema: Schema = new Schema({
  userId: { type: UserSchema },
  licenseId: { type: String },
  startedAt: { type: Date },
  expiredAt: { type: Date },
  status: { type: String, enum: licenseStatusEnum },
  detailsTimePriceLicense: { type: DetailsTamePriceLicense },
})

export const License = mongoose.model<ILicense>('License', LicenseSchema)
