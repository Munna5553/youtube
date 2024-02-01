import mongoose from "mongoose";
import { database } from '../constaints.js';

const dbConfig = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${database}`);

        const db = mongoose.connection
        db.on('connected', () => {
            console.log("successfully connected to database");
        });
        db.on('error', () => {
            console.log("error to connecting database");
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default dbConfig;