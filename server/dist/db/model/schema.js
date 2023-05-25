"use strict";
// ایجاد شیء User با اطلاعات
const newUser = new user({
    username: 'John',
    userId: 'jhasdbawd51658hjkad54',
    licenseId: '5165kadbsfhjbe541ga'
});
// ذخیره کردن کاربر در دیتابیس
newUser.save()
    .then(() => {
    console.log('کاربر با موفقیت در دیتابیس ذخیره شد.');
})
    .catch((error) => {
    console.error('خطا در ذخیره کاربر در دیتابیس:', error);
});
