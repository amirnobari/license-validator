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
const mongoose_1 = __importDefault(require("mongoose"));
const ws_1 = __importDefault(require("ws"));
const user_model_1 = require("./db/models/user.model");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
// اتصال به دیتابیس MongoDB
mongoose_1.default
    .connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`, {
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
})
    .then(() => {
    console.log('Database Is Connected!');
})
    .catch((error) => {
    console.error('خطا در اتصال به دیتابیس:', error);
});
// ایجاد کاربر جدید
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { username, userId, licenseId } = req.body;
    try {
        // بررسی وجود کاربر با مشخصات داده شده در دیتابیس
        const existingUser = yield user_model_1.User.findOne({ userId });
        if (existingUser) {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود دارد.');
            // بررسی وجود ویژگی socket
            if (existingUser.socket) {
                // ذخیره اطلاعات کلاینت در دیتابیس
                const socket = existingUser.socket;
                // ارسال پیام به کلاینت
                const JsonMessage = JSON.stringify({
                    msg: 'Hi From Server'
                });
                const message = Buffer.from(JsonMessage);
                socket.send(message);
                socket.on('message', function message(message) {
                    const JsonData = new TextDecoder('utf-8').decode(message);
                    const data = JSON.parse(JsonData);
                    console.log('received:', data);
                    console.log(`کاربر ${data.userId} متصل شد.`);
                });
            }
            else {
                console.log('کاربر ویژگی socket ندارد.');
            }
        }
        else {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود ندارد.');
            // ایجاد کاربر جدید
            const newUser = new user_model_1.User({
                username,
                userId,
                licenseId,
                socket: null // یا مقدار دلخواه خود را بگذارید
            });
            yield newUser.save();
            // ارسال پیام به کلاینت
            const JsonMessage = JSON.stringify({
                msg: 'سلام از سمت سرور'
            });
            const message = Buffer.from(JsonMessage);
            (_a = newUser.socket) === null || _a === void 0 ? void 0 : _a.send(message);
            (_b = newUser.socket) === null || _b === void 0 ? void 0 : _b.on('message', function message(message) {
                const JsonData = new TextDecoder('utf-8').decode(message);
                const data = JSON.parse(JsonData);
                console.log('received:', data);
                console.log(`کاربر ${data.userId} متصل شد.`);
            });
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
// تنظیم WebSocket
const database = {}; // تعریف متغیر database
wss.on('connection', function connection(socket, req) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        socket.on('error', console.error);
        const userId = req.headers['userid'];
        const clientId = userId;
        try {
            const existingUser = yield user_model_1.User.findOne({ userId });
            if (existingUser) {
                console.log('User found in database.');
                // مقداردهی متغیر socket در دیتابیس
                existingUser.socket = socket;
                yield existingUser.save();
                // ارسال پیام به کلاینت
                const JsonMessage = JSON.stringify({
                    msg: 'Hi From Server'
                });
                const message = Buffer.from(JsonMessage);
                (_a = existingUser.socket) === null || _a === void 0 ? void 0 : _a.send(message);
                socket.on('message', function incoming(message) {
                    const JsonData = new TextDecoder('utf-8').decode(message);
                    const data = JSON.parse(JsonData);
                    console.log('received:', data);
                    console.log(`User ${data.userId} Connected.`);
                });
            }
            else {
                console.log('User does not exist in the database.');
                // ارسال پیام اخطار به کلاینت
                const JsonMessage = JSON.stringify({
                    msg: 'Invalid user'
                });
                const message = Buffer.from(JsonMessage);
                socket.send(message);
                // قطع اتصال کلاینت
                socket.close();
            }
        }
        catch (error) {
            console.error('خطا در دسترسی به دیتابیس:', error);
        }
        socket.on('close', function close() {
            console.log(`Client ${userId} has disconnected`);
        });
        if (userId === 'jhasdbawd51658hjkad54') {
            try {
                const user = yield user_model_1.User.findOne({ userId });
                if (user) {
                    const JsonMessage = JSON.stringify({
                        msg: 'hiiii'
                    });
                    const message = Buffer.from(JsonMessage);
                    socket.send(message);
                }
            }
            catch (error) {
                console.error('خطا در دسترسی به دیتابیس:', error);
            }
        }
        socket.on('close', () => {
            console.log(`Client ${clientId} has disconnected`);
        });
    });
});
// اجرای سرور
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server Is Runnig In Port ${port}`);
});
