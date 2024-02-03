import mongoose from "mongoose";

export const Connection =async()=>{
    try {
      const dbConnect = await mongoose.connect(process.env.DB_URL)
      console.log(`Connected to Database ${dbConnect.connection.host}`)
    } catch (error) {
        console.log(`Error in MongoDb ${error}`)
    }
}


