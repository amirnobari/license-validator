"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailsTamePriceLicense = void 0;
const details_time_price_license_enum_1 = require("../../enums/details-time-price-license.enum");
exports.DetailsTamePriceLicense = {
    price: {
        type: String,
        enum: details_time_price_license_enum_1.DetailsLicensePriceEnum
    },
    time: {
        type: String,
        enum: details_time_price_license_enum_1.DetailsLicenseTimeEnum,
    }
};
