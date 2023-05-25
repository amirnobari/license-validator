"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_userinfo_1 = __importDefault(require("./db/connect.userinfo"));
const userinfo_model_1 = __importDefault(require("./db/models/userinfo.model"));
const app = (0, express_1.default)();
// اتصال به دیتابیس
(0, connect_userinfo_1.default)();
// Middleware برای دریافت داده‌های JSON در بدنه درخواست
app.use(express_1.default.json());
// روت برای ایجاد کاربر جدید
app.post('/userinfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, userId, licenseId } = req.body;
        // ایجاد کاربر جدید با استفاده از مدل
        const user = new userinfo_model_1.default({
            username,
            userId,
            licenseId,
        });
        // ذخیره کاربر در دیتابیس
        yield user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'خطا در سرور' });
    }
}));
// راه‌اندازی سرور
app.listen({ port: parseInt(process.env.APP_PORT || '8080') }, () => {
    console.log('سرور در حال اجراست...');
});
