"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_userinfo_1 = require("../connect.userinfo");
const userSchema = new connect_userinfo_1.mongoose.Schema({
    username: String,
    userId: String,
    licenseId: String,
});
const User = connect_userinfo_1.mongoose.model('User', userSchema);
exports.default = User;
