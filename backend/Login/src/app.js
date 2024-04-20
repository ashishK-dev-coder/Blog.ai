import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";

const app = express();

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"

//routes declaration
app.use("/api/v1/login/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)


export { app };