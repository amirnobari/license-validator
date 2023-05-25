"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    age: Number,
    email: String,
}, {
    collection: 'user_info' // تغییر نام کالکشن به 'my_custom_collection'
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
