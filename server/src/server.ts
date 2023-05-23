
import { WebSocketServer } from 'ws'
const wss = new WebSocketServer({ port: 8080 })
// شیء برای ذخیره اطلاعات کلاینت‌ها
const database: any = {
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
}


wss.on('connection', function connection(ws, req) {
    ws.on('error', console.error)
    const userId = req.headers['userid'] as string
    console.log(userId)
    let clientId: string = ''

    if (userId in database) {
        console.log('User found in database.')
        // ذخیره اطلاعات کلاینت
        const client = {
            id: userId,
            socket: ws
        }
        clientId = userId
        database[userId] = client
        const JsonMessage = JSON.stringify({
            msg: 'Hi From Server'
        })
        const message = Buffer.from(JsonMessage)
        ws.send(message)

    } else {
        const JsonMessage = JSON.stringify({
            msg: 'Invalid user'
        })
        const message = Buffer.from(JsonMessage)

        console.log('User not found in database. Warning!')
        // ارسال پیام اخطار به کلاینت
        ws.send(message)
        // قطع اتصال کلاینت
        // ws.close();
    }

    ws.on('message', function message(message: any) {

        const JsonData: any = new TextDecoder('utf-8').decode(message)
        const data: any = JSON.parse(JsonData)
        console.log('received:', data)
        console.log(`User ${data.userId} Connected.`)
        // بررسی وجود شناسه کاربر در دیتابیس

    })

    ws.on('close', () => {
        console.log(`Client ${clientId} has disconnected`)
    })
})
