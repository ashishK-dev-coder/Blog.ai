import express from "express";
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Ejs
app.set("view engine", "ejs");
app.set("views", "./views");

//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"

//routes declaration
app.use("/api/v1/verify-email-otp/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)


export { app };