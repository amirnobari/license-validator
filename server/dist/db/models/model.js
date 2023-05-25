"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User', Schema);
const user = new User({
    username: 'John',
    userId: '123',
    licenseId: 'ABC123',
});
// سایر قسمت‌های کد...
user.save()
    .then(() => {
    console.log('اطلاعات با موفقیت ذخیره شد.');
})
    .catch((error) => {
    console.error('خطا در ذخیره اطلاعات:', error);
});
const User = mongoose_1.default.model('User', Schema);
