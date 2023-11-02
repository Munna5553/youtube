import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/',(req,res)=>{
    res.status(200).send("Home");
});

export default app;