import express from 'express'
import cors from 'cors'
import Connect from './MongoDB/connect.js'
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRouter.js";
import userRoutes from "./routes/userRouter.js";
import discussionRoutes from "./routes/discussionRouter.js";
import replyRoutes from "./routes/replyRouter.js";


dotenv.config();




const app = express()
app.use(express.json())
app.use(cors())


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // עבור 15 דקות
    max: 100, // מגבלה ל100 בקשות עבור כל משתמש
    message: {
        message: "Too many requests, please try again later."
    }
});

app.use(limiter);



app.get('/',(req,res)=>{
    res.send('hello world')
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/replies", replyRoutes);





app.listen(process.env.PORT, ()=>{
console.log(`server is on http://localhost:${process.env.PORT}`);
Connect();
})