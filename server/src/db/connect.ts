import mongoose from 'mongoose';

mongoose.connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`, {
  
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
})
  .then(() => {
    console.log('اتصال به دیتابیس برقرار شد.');
  })
  .catch((error) => {
    console.error('خطا در اتصال به دیتابیس:', error);
  });

export default mongoose.connection;
