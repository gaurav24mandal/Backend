import express, { Router, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(express.json({limit : "16kb"}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(urlencoded({ extended : true ,limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routing 

import userRouter from './routes/user.router.js';
app.use((req, res, next) => {
    console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
    next();
  });
console.log('hi router');

app.use("/api/v1/users", userRouter)
app.get("/",(req,res)=>{
     res.send("hi")
     console.log('ko');
     
    })



export default app;