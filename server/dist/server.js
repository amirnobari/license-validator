"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// آرایه‌ای برای ذخیره اطلاعات کلاینت‌ها
const database = [];
const wss = new ws_1.WebSocketServer({ port: 8080 });
// تابع تولید شناسه کلاینت
function generateClientId() {
    // بر اساس طول آرایه clients و زمان فعلی یک شناسه یکتا تولید می‌کند
    return database.length.toString() + Date.now().toString();
}
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    let clientId = '';
    ws.on('message', function message(message) {
        const JsonData = new TextDecoder('utf-8').decode(message);
        const data = JSON.parse(JsonData);
        console.log('received:', data);
        console.log(`User ${data.userId} Connected.`);
        // ذخیره اطلاعات کلاینت
        const client = {
            id: data.userId,
            socket: ws
        };
        clientId = data.userId;
        database.push(client);
    });
    ws.send(`Hi From Server`);
    ws.on('close', () => {
        console.log(`Client ${clientId} has disconnected`);
        // حذف اطلاعات کلاینت از آرایه
        const index = database.findIndex((client) => client.id === clientId);
        if (index !== -1) {
            database.splice(index, 1);
        }
    });
});
