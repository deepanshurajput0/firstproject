import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
     type:String,
     required:true,
     trim:true,
    },
    lastname:{
      type:String,
      required:true,
      trim:true
    },
    email:{
      type:String,
      required:true,
      unqiue:true
    },
    password:{
        type:String,
        required:true
    },
    fathername:{
      type:String,
      required:true
    },
    role:{
        type:Number,
        default:0,
    }   

},{timestamps:true})

export default mongoose.model('users',userSchema)
