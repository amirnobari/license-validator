"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ws = new ws_1.default(`${process.env.URL_CONNECTION}`);
ws.on('error', console.error);
ws.on('open', function open() {
    const JsonData = JSON.stringify({
        username: "client_2",
        userId: "7468s4f66asf6fa6fsa46saf",
        licenseId: "as54d6asd4a4sd8asd685"
    });
    const bufferData = Buffer.from(JsonData);
    ws.send(bufferData);
});
ws.on('message', function message(data) {
    console.log('received: %s', data);
});
