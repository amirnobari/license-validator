"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const wss = new ws_1.WebSocketServer({
    host: process.env.APP_HOSTNAME,
    port: +process.env.APP_PORT
});
// آرایه‌ای برای ذخیره اطلاعات کلاینت‌ها
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
    let clientId = req.headers.user_id;
    database[clientId].ws = ws;
    ws.on('message', function message(message) {
        const JsonData = new TextDecoder('utf-8').decode(message);
        const data = JSON.parse(JsonData);
        console.log('received:', data);
        console.log(`User ${data.userId} Connected.`);
    });
    if (clientId == 'jhasdbawd51658hjkad54') {
        for (const usersInfo in database) {
            if (usersInfo == clientId) {
                const ws = database[usersInfo].ws;
                if (ws)
                    ws.send(`Hi From Server`);
            }
        }
    }
    ws.on('close', () => {
        console.log(`Client ${clientId} has disconnected`);
    });
});
