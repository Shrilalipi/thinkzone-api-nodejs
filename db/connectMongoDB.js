import mongoose, { Mongoose } from 'mongoose';

export const connectMongoDB = () => {
    try {
        const tzdbUri = process.env.DB_URI;
        const wpDbUri = process.env.WP_DB_URI;

        const instance1 = new Mongoose();
        instance1.connect(tzdbUri);
        const instance2 = new Mongoose();
        instance2.connect(wpDbUri);

        // mongoose.connect(dbUri);
        console.log("DB connected successfully");
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}