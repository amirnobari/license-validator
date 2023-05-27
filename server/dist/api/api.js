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
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const user_model_1 = require("../db/models/user.model");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
const connect_1 = require("../db/connect");
const license_model_1 = require("../db/models/license.model");
const license_enum_1 = require("../enums/license.enum");
(0, connect_1.DbConnection)();
app.use(express_1.default.json());
// ایجاد کاربر جدید
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        // بررسی وجود کاربر با مشخصات داده شده در دیتابیس
        const existingUser = yield user_model_1.User.findOne({ username });
        if (existingUser) {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود دارد.');
        }
        else {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود ندارد.');
            // ایجاد کاربر جدید
            const newUser = new user_model_1.User({
                username,
            });
            yield newUser.save();
        }
        res.status(201).json({ message: 'کاربر جدید ایجاد شد' });
    }
    catch (error) {
        console.error('خطا در ایجاد کاربر:', error);
        res.status(500).json({ message: 'خطا در ایجاد کاربر', error });
    }
}));
// تنظیم روت برای دریافت لیست کاربران
app.get('/users', (req, res) => {
    // دریافت لیست کاربران از دیتابیس با استفاده از مدل User
    user_model_1.User.find()
        .then((users) => {
        res.json(users);
    })
        .catch((error) => {
        res.status(500).json({ message: 'خطا در دریافت لیست کاربران', error });
    });
});
//create license api whith post 
app.post('/license', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, detailsTimePriceLicense } = req.body;
        let time = detailsTimePriceLicense.time;
        let timeArr = time.split('-');
        let number = Number(timeArr[0]);
        let type = timeArr[1];
        if (type == 'd') {
            number = number;
        }
        if (type == 'm') {
            number = number * 30;
        }
        if (type == 'y') {
            number = number * 365;
        }
        let startetAt = new Date(Date.now());
        let nowDate = new Date(Date.now());
        let expiredAt = new Date(nowDate.setDate(nowDate.getDate() + number));
        const user = yield user_model_1.User.findById(userId);
        const license = new license_model_1.License({
            userId: user,
            startetAt,
            expiredAt,
            detailsTimePriceLicense,
            status: license_enum_1.licenseStatusEnum.Enable,
        });
        const result = yield license.save();
        res.status(201).json(result);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'خطا در  لیست کاربران', error });
    }
}));
//create api with get
app.get('/license', (req, res) => {
    // دریافت لیست کاربران از دیتابیس با استفاده از مدل User
    license_model_1.License.find()
        .then((users) => {
        res.json(users);
    })
        .catch((error) => {
        res.status(500).json({ message: 'خطا در دریافت لیست کاربران', error });
    });
});
// اجرای سرور
const port = 8080;
server.listen(port, () => {
    console.log(`Server Is Runnig In Port ${port}`);
});
