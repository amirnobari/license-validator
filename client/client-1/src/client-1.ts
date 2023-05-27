import WebSocket from 'ws'
import { config } from 'dotenv'

config()

const ws = new WebSocket(`${process.env.URL_CONNECTION}`, {
    headers: {
        'userid': '6471f14075bc208e6e86ccc4',
    }
});

ws.on('error', console.error)

ws.on('open', function open() {
    const jsonData = JSON.stringify({
        username: "client_1",
        licenseId: "6471f31532236b448c84a0f5"
    });
    const bufferData = Buffer.from(jsonData)
    ws.send(bufferData)
});

ws.on('message', function message(message: any) {
    const JsonData: any = new TextDecoder('utf-8').decode(message)
    const data: any = JSON.parse(JsonData)
    console.log('Server Message:', data)
})
