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
const ws_1 = __importDefault(require("ws"));
const connect_1 = require("./db/connect");
const user_model_1 = require("./db/models/user.model");
const license_model_1 = require("./db/models/license.model");
const database = {
    '6471f14075bc208e6e86ccc4': {
        ws: null,
    },
    '6471f1b6ab729b8fb734d2c0': {
        ws: null,
    }
};
const wss = new ws_1.default.Server({ port: 8080 });
(0, connect_1.DbConnection)();
// تنظیم WebSocket
wss.on('connection', function connection(ws, req) {
    return __awaiter(this, void 0, void 0, function* () {
        ws.on('error', console.error);
        const userId = req.headers['userid'];
        console.log(`User ${userId} Connected.`);
        database[userId].ws = wss;
        try {
            const existingUser = yield user_model_1.User.findOne({ _id: userId });
            if (!existingUser) {
                console.log('User does not exist in the database.');
                // ارسال پیام اخطار به کلاینت
                const JsonMessage = JSON.stringify({
                    msg: 'Invalid user'
                });
                const message = Buffer.from(JsonMessage);
                ws.send(message);
                // قطع اتصال کلاینت
                ws.close();
            }
            console.log('User found in database.');
            // ارسال پیام به کلاینت
            const JsonMessage = JSON.stringify({
                msg: 'Hi From Server'
            });
            const message = Buffer.from(JsonMessage);
            ws.send(message);
            ws.on('message', function incoming(message) {
                return __awaiter(this, void 0, void 0, function* () {
                    const JsonData = new TextDecoder('utf-8').decode(message);
                    const data = JSON.parse(JsonData);
                    console.log('received:', data);
                    const licenseId = data['licenseId'];
                    console.log('licenseId===>', licenseId);
                    const license = yield license_model_1.License.findById(licenseId);
                    console.log('license===>', license);
                    if (license) {
                        const JsonMessage = JSON.stringify({
                            msg: 'License Is Ok'
                        });
                        const message = Buffer.from(JsonMessage);
                        ws.send(message);
                    }
                    else {
                        const JsonMessage = JSON.stringify({
                            msg: 'License Is Not Ok'
                        });
                        const message = Buffer.from(JsonMessage);
                        ws.send(message);
                    }
                    const checkDate = license === null || license === void 0 ? void 0 : license.expiredAt;
                    if (checkDate) {
                        let todyTime = Date.now();
                        let expiredTime = checkDate.getTime();
                        let result = expiredTime - todyTime;
                        if (result > 0) {
                            let time = result / 1000 / 60 / 60 / 24;
                            console.log(time, 'rooz az etebare shoma mande ast.');
                        }
                        else {
                            console.log('az tarikhe shoma gozashte');
                        }
                    }
                });
            });
            ws.on('close', function close() {
                console.log(`Client ${userId} has disconnected`);
            });
        }
        catch (error) {
            console.error('خطا در دسترسی به دیتابیس:', error);
        }
    });
});
