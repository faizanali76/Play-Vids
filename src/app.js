import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CROS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




//import router
import userRouter from "./routes/user.route.js"

app.use("/api/v1/users", userRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

export {app}


