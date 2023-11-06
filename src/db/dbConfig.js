import mongoose from "mongoose";
import { db_name } from '../constaints.js'

const dbConfig = async () => {
    try {
        const dbconnect = await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`);

        console.log(dbconnect.connection.host,process.env.MONGO_URI);
    } catch (error) {
        console.log("mongodb connection failed: ", error);
        process.exit(1);
    }
}

export default dbConfig;