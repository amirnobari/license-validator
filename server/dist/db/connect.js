"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function DbConnection() {
    mongoose_1.default.connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`, {
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    })
        .then(() => {
        console.log('اتصال به دیتابیس برقرار شد.');
    })
        .catch((error) => {
        console.error('خطا در اتصال به دیتابیس:', error);
    });
}
exports.DbConnection = DbConnection;
