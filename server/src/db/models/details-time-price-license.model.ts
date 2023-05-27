import { DetailsLicensePriceEnum, DetailsLicenseTimeEnum } from '../../enums/details-time-price-license.enum'


export const DetailsTamePriceLicense = {
  price: {
    type: String,
    enum: DetailsLicensePriceEnum
  },
  time: {
    type: String,
    enum: DetailsLicenseTimeEnum,
  }
}
