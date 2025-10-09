import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

//
app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 

import userRouter from "./routes/user.routes.js";


// routes declaration 
app.use("/api/v1/users", userRouter)

//when hitting on ../users endpoint, it will redirect to user.router.js file and will execute the logic 


// http://localhost:8000/api/v1/users/register (best practices)

export { app }
// export default app
