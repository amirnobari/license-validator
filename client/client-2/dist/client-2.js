"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ws = new ws_1.default(`${process.env.URL_CONNECTION}`, {
    headers: {
        'userid': '6471f1b6ab729b8fb734d2c0',
    }
});
ws.on('error', console.error);
ws.on('open', function open() {
    const jsonData = JSON.stringify({
        username: "client_2",
        licenseId: "6471f37dfbec14d64f28bfb6"
    });
    const bufferData = Buffer.from(jsonData);
    ws.send(bufferData);
});
ws.on('message', function message(message) {
    const JsonData = new TextDecoder('utf-8').decode(message);
    const data = JSON.parse(JsonData);
    console.log('Server Message:', data);
});
