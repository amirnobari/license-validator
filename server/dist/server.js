"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// شیء برای ذخیره اطلاعات کلاینت‌ها
const database = {
    'jhasdbawd51658hjkad54': {
        ws: null,
        username: "client_1",
        licenseId: "5165kadbsfhjbe541ga"
    },
    '7468s4f66asf6fa6fsa46saf': {
        ws: null,
        username: "client_2",
        licenseId: "as54d6asd4a4sd8asd685"
    }
};
wss.on('connection', function connection(ws, req) {
    ws.on('error', console.error);
    const userId = req.headers['userid'];
    let clientId = '';
    if (userId in database) {
        console.log('User found in database.');
        // ذخیره اطلاعات کلاینت
        const client = {
            id: userId,
            socket: ws
        };
        clientId = userId;
        database[userId] = client;
        const JsonMessage = JSON.stringify({
            msg: 'Hi From Server'
        });
        const message = Buffer.from(JsonMessage);
        ws.send(message);
        ws.on('message', function message(message) {
            const JsonData = new TextDecoder('utf-8').decode(message);
            const data = JSON.parse(JsonData);
            console.log('received:', data);
            console.log(`User ${data.userId} Connected.`);
        });
    }
    else {
        const JsonMessage = JSON.stringify({
            msg: 'Invalid user'
        });
        const message = Buffer.from(JsonMessage);
        console.log('User not found in database. Warning!');
        // ارسال پیام اخطار به کلاینت
        ws.send(message);
        // قطع اتصال کلاینت
        ws.close();
    }
    ws.on('close', () => {
        console.log(`Client ${clientId} has disconnected`);
    });
    database[userId].ws = ws;
    if (userId == '7468s4f66asf6fa6fsa46saf') {
        for (const usersInfo in database) {
            if (usersInfo == userId) {
                const ws = database[usersInfo].ws;
                if (ws) {
                    const JsonMessage = JSON.stringify({
                        msg: 'hiiii'
                    });
                    const message = Buffer.from(JsonMessage);
                    ws.send(message);
                }
            }
        }
    }
});
