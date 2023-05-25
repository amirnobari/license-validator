import express, { Request, Response } from 'express'
import http from 'http'
import mongoose from 'mongoose'
import WebSocket from 'ws'
import { User } from "./db/models/user.model"

const app = express()
app.use(express.json())

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// اتصال به دیتابیس MongoDB
mongoose
    .connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`, {
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    })
    .then(() => {
        console.log('Database Is Connected!')
    })
    .catch((error) => {
        console.error('خطا در اتصال به دیتابیس:', error)
    })

// ایجاد کاربر جدید
app.post('/users', async (req: Request, res: Response) => {
    const { username, userId, licenseId } = req.body

    try {
        // بررسی وجود کاربر با مشخصات داده شده در دیتابیس
        const existingUser = await User.findOne({ userId })

        if (existingUser) {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود دارد.')

            // بررسی وجود ویژگی socket
            if (existingUser.socket) {
                // ذخیره اطلاعات کلاینت در دیتابیس
                const socket = existingUser.socket

                // ارسال پیام به کلاینت
                const JsonMessage = JSON.stringify({
                    msg: 'Hi From Server'
                })
                const message = Buffer.from(JsonMessage)
                socket.send(message)

                socket.on('message', function message(message: any) {
                    const JsonData: any = new TextDecoder('utf-8').decode(message)
                    const data: any = JSON.parse(JsonData)
                    console.log('received:', data)
                    console.log(`کاربر ${data.userId} متصل شد.`)
                })
            } else {
                console.log('کاربر ویژگی socket ندارد.')
            }
        } else {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود ندارد.')

            // ایجاد کاربر جدید
            const newUser = new User({
                username,
                userId,
                licenseId,
                socket: null // یا مقدار دلخواه خود را بگذارید
            })
            await newUser.save()

            // ارسال پیام به کلاینت
            const JsonMessage = JSON.stringify({
                msg: 'سلام از سمت سرور'
            })
            const message = Buffer.from(JsonMessage)
            newUser.socket?.send(message)

            newUser.socket?.on('message', function message(message: any) {
                const JsonData: any = new TextDecoder('utf-8').decode(message)
                const data: any = JSON.parse(JsonData)
                console.log('received:', data)
                console.log(`کاربر ${data.userId} متصل شد.`)
            })
        }

        res.status(201).json({ message: 'کاربر جدید ایجاد شد' })
    } catch (error) {
        console.error('خطا در ایجاد کاربر:', error)
        res.status(500).json({ message: 'خطا در ایجاد کاربر', error })
    }
})

// تنظیم روت برای دریافت لیست کاربران
app.get('/users', (req: Request, res: Response) => {
    // دریافت لیست کاربران از دیتابیس با استفاده از مدل User
    User.find()
        .then((users) => {
            res.json(users)
        })
        .catch((error) => {
            res.status(500).json({ message: 'خطا در دریافت لیست کاربران', error })
        })
})

// تنظیم WebSocket
const database: { [userId: string]: { ws?: WebSocket } } = {} // تعریف متغیر database
wss.on('connection', async function connection(socket, req) {
    socket.on('error', console.error)
    const userId = req.headers['userid'] as string
    const clientId = userId as string
    try {
        const existingUser = await User.findOne({ userId })
        if (existingUser) {
            console.log('User found in database.')

            // مقداردهی متغیر socket در دیتابیس
            existingUser.socket = socket
            await existingUser.save()

            // ارسال پیام به کلاینت
            const JsonMessage = JSON.stringify({
                msg: 'Hi From Server'
            })
            const message = Buffer.from(JsonMessage)
            existingUser.socket?.send(message)

            socket.on('message', function incoming(message: any) {
                const JsonData: any = new TextDecoder('utf-8').decode(message)
                const data: any = JSON.parse(JsonData)
                console.log('received:', data)
                console.log(`User ${data.userId} Connected.`)
            })
        } else {
            console.log('User does not exist in the database.')

            // ارسال پیام اخطار به کلاینت
            const JsonMessage = JSON.stringify({
                msg: 'Invalid user'
            })
            const message = Buffer.from(JsonMessage)
            socket.send(message)
            // قطع اتصال کلاینت
            socket.close()
        }
    } catch (error) {
        console.error('خطا در دسترسی به دیتابیس:', error)
    }

    socket.on('close', function close() {
        console.log(`Client ${userId} has disconnected`)
    })

    if (userId === 'jhasdbawd51658hjkad54') {
        try {
            const user = await User.findOne({ userId })

            if (user) {
                const JsonMessage = JSON.stringify({
                    msg: 'hiiii'
                })
                const message = Buffer.from(JsonMessage)
                socket.send(message)
            }
        } catch (error) {
            console.error('خطا در دسترسی به دیتابیس:', error)
        }
    }

    socket.on('close', () => {
        console.log(`Client ${clientId} has disconnected`)
    })
})

// اجرای سرور
const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log(`Server Is Runnig In Port ${port}`)
})
