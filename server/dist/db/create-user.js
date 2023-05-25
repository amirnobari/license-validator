"use strict";
// server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userinfo_model_1 = __importDefault(require("./models/userinfo.model"));
const connect_1 = __importDefault(require("./connect"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// اتصال به دیتابیس
(0, connect_1.default)();
// روت پست برای ذخیره اطلاعات کاربر جدید
app.post('/users', (req, res) => {
    // دریافت اطلاعات از درخواست
    const { username, userId, licenseId } = req.body;
    // ساخت نمونه از مدل UserInfo
    const userInfo = new userinfo_model_1.default({
        username,
        userId,
        licenseId,
    });
    // ذخیره کردن نمونه در دیتابیس
    userInfo
        .save()
        .then(() => {
        res.status(201).json({ message: 'اطلاعات با موفقیت ذخیره شد.' });
    })
        .catch((error) => {
        res.status(500).json({ error: 'خطا در ذخیره اطلاعات.' });
    });
});
// راه‌اندازی سرور
const port = process.env.APP_PORT || 8080;
app.listen(port, () => {
    console.log(`سرور اجرا شد در پورت ${port}.`);
});
