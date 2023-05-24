import WebSocket from 'ws'
import { config } from 'dotenv'

config()

const ws = new WebSocket(`${process.env.URL_CONNECTION}`, {
    headers: {
        'userid': '7468s4f66asf6fa6fsa46saf',
    }
})

ws.on('error', console.error)

ws.on('open', function open() {
    const jsonData = JSON.stringify({
        username:"client_2",
        userId: "7468s4f66asf6fa6fsa46saf",
        licenseId: "as54d6asd4a4sd8asd685"
    })
    const bufferData = Buffer.from(jsonData)
    ws.send(bufferData)
})

ws.on('message', function message(message: any) {
    const JsonData: any = new TextDecoder('utf-8').decode(message)
    const data: any = JSON.parse(JsonData)
    console.log('Server Message:', data)
})
