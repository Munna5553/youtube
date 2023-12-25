import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(express.static("public"));
app.use(cookieParser());

//routes

import userRouter from './routes/user.routes.js';

app.use("/api/users", userRouter);


export default app;