import express from "express"
import dotenv from 'dotenv'
import { Connection } from "./config/db.js"
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoute from './routes/productRoutes.js'
const app = express()
const PORT = process.env.PORT || 8000
dotenv.config();
app.use(cors())

app.use(express.json())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoute)
// app.get('/',(req,res)=>{
//   res.json({
//     name:'ecommerce app'
//   })
// })

Connection()
app.use(express.static("public/upload/"))
app.listen(PORT,()=>{
    console.log('Server is running')
})

