import express, { Request, Response } from 'express'
import http from 'http'
import WebSocket from 'ws'
import { User } from '../db/models/user.model'
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

import { DbConnection } from '../db/connect'
import { License } from '../db/models/license.model'
import { licenseStatusEnum } from '../enums/license.enum'
DbConnection()



app.use(express.json())
// ایجاد کاربر جدید
app.post('/users', async (req: Request, res: Response) => {
    const { username } = req.body

    try {
        // بررسی وجود کاربر با مشخصات داده شده در دیتابیس
        const existingUser = await User.findOne({ username })

        if (existingUser) {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود دارد.')

        } else {
            console.log('کاربر با مشخصات داده شده در دیتابیس وجود ندارد.')
            // ایجاد کاربر جدید
            const newUser = new User({
                username,
            })
            await newUser.save()
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


//create license api whith post 
app.post('/license', async (req: Request, res: Response) => {

    try {
        const { userId, detailsTimePriceLicense } = req.body
        let time = detailsTimePriceLicense.time
        let timeArr = time.split('-')
        let number = Number(timeArr[0])
        let type = timeArr[1]

        if (type == 'd') {
            number = number
        }
        if (type == 'm') {
            number = number * 30
        }
        if (type == 'y') {
            number = number * 365
        }
        let startetAt = new Date(Date.now())
        let nowDate = new Date(Date.now())
        let expiredAt = new Date(nowDate.setDate(nowDate.getDate() + number))
        const user = await User.findById(userId)
        const license = new License({
            userId: user,
            startetAt,
            expiredAt,
            detailsTimePriceLicense,
            status: licenseStatusEnum.Enable,
        })

        const result = await license.save()

        res.status(201).json(result)
        return


    } catch (error) {
        res.status(500).json({ message: 'خطا در  لیست کاربران', error })
    }

})

//create api with get
app.get('/license', (req: Request, res: Response) => {
    // دریافت لیست کاربران از دیتابیس با استفاده از مدل User
    License.find()
        .then((users) => {
            res.json(users)
        })
        .catch((error) => {
            res.status(500).json({ message: 'خطا در دریافت لیست کاربران', error })
        })
})

// اجرای سرور
const port = 8080
server.listen(port, () => {
    console.log(`Server Is Runnig In Port ${port}`)
})

