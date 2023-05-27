import WebSocket from 'ws'
import { DbConnection } from './db/connect'
import { User } from './db/models/user.model'
import { License } from './db/models/license.model'

const database: any = {
    '6471f14075bc208e6e86ccc4': {
        ws: null,
    },
    '6471f1b6ab729b8fb734d2c0': {
        ws: null,
    }
}

const wss = new WebSocket.Server({ port: 8080 })
DbConnection()

// تنظیم WebSocket
wss.on('connection', async function connection(ws, req) {

    ws.on('error', console.error)
    const userId = req.headers['userid'] as string
    console.log(`User ${userId} Connected.`)
    database[userId].ws = wss

    try {
        const existingUser = await User.findOne({ _id: userId })
        if (!existingUser) {
            console.log('User does not exist in the database.')
            // ارسال پیام اخطار به کلاینت
            const JsonMessage = JSON.stringify({
                msg: 'Invalid user'
            })
            const message = Buffer.from(JsonMessage)
            ws.send(message)
            // قطع اتصال کلاینت
            ws.close()
        }
        console.log('User found in database.')
        // ارسال پیام به کلاینت
        const JsonMessage = JSON.stringify({
            msg: 'Hi From Server'
        })
        const message = Buffer.from(JsonMessage)
        ws.send(message)

        ws.on('message', async function incoming(message: any) {
            const JsonData: any = new TextDecoder('utf-8').decode(message)
            const data: any = JSON.parse(JsonData)
            console.log('received:', data)
            const licenseId: string = data['licenseId']
            console.log('licenseId===>', licenseId)
            const license = await License.findById(licenseId)
            console.log('license===>', license)

            if (license) {
                const JsonMessage = JSON.stringify({
                    msg: 'License Is Ok'
                })
                const message = Buffer.from(JsonMessage)
                ws.send(message)
            } else {
                const JsonMessage = JSON.stringify({
                    msg: 'License Is Not Ok'
                })
                const message = Buffer.from(JsonMessage)
                ws.send(message)
            }
            const checkDate = license?.expiredAt            
            if (checkDate) {
                let todyTime=Date.now()                
                let  expiredTime= checkDate.getTime()                
                let result = expiredTime-todyTime
               
                if(result>0){
                    let time=result/1000/60/60/24;
                    console.log(time,'rooz az etebare shoma mande ast.');
                }else{
                    console.log('az tarikhe shoma gozashte');
                }
            }
        })

        ws.on('close', function close() {
            console.log(`Client ${userId} has disconnected`)
        })

    } catch (error) {
        console.error('خطا در دسترسی به دیتابیس:', error)
    }
})
