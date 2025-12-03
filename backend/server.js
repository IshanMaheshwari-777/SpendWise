import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import path from "path"
import authRoutes from "./routes/authRoutes.js"
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from "./routes/expenseRoutes.js"
import { fileURLToPath } from 'url';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app=express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
    origin:process.env.CLIENT_URL||"*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"] 
}))

app.use(express.json())

const PORT=process.env.PORT||8080


app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboardRoutes)
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
