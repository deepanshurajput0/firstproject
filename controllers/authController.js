import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import orderModel from "../models/orderModel.js";
export const registerController =async(req,res)=>{
   try {
    const { name , lastname ,email , password, fathername } = req.body;
    if( !name ||  !lastname||  !email || !password || !fathername){
        return res.send({error:'All fields are required'})
    }
    const existingUser = await userModel.findOne({email})
    if(existingUser){
       return res.status(200).send({
            success:false,
            message:'User Already Exists please login'
        })
    }else{
        const hashedPassword = await hashPassword(password)
    
        const user = await new userModel({name,lastname,email,password:hashedPassword ,fathername}).save()
        
         res.status(201).send({
            success: true,
            message: 'User Register SuccessFully',
            user
         })
    }
 
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message: 'Error in Registration',
        error
    })
   }
}


export const loginController =async(req,res)=>{
   try {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(404).send({
            success:false,
            message:'Invalid email or password'
        })
    }
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(404).send({
            success:false,
            message:'Email is not registered'
        })
    }
    const match = await comparePassword(password, user.password) 
    if(!match){
        return res.status(200).send({
            success:false,
            message:'Invalid password'
        })
    }
    // token
    const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
    res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
            name: user.name,
            email:user.email,
            role: user.role, 
        }, 
        token 
    })
   } catch (error) {
     console.log(error)
     res.status(500).send({
        success:false,
        message:'Error in login',
        error
     })
   }

}


// forgot password 

export const forgotPasswordController=async(req,res)=>{
  try {
    const { email, fathername , newPassword } = req.body
    if(!email){
        res.status(400).send({message:'Email is required'})
    }
    if(!fathername){
        res.status(400).send({message:'fathername is Required'})
    }
    if(!newPassword){
        res.status(400).send({message:"NewPassword is Required"})
    }
    const user = await userModel.findOne({email, fathername})
    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:'wrong email or name'
        })
    }
    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
        success: true,
        message:'Password Reset SuccessFully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Something went wrong',
        error
    })
  }
}

export const testController =(req,res)=>{
 console.log('protected route')
 res.send({
    test : 'protected route'
 })
}


export const updateProfileController=async(req,res)=>{
    try {
        const { name, lastname,  password } = req.body
        const user = await userModel.findById(req.user._id)

        if(password && password.length < 6){
            return res.json({error:'Password is required and 6 character long'})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            lastname:lastname || user.lastname,
            password:hashedPassword || user.password,
           
        },{new:true})
        res.status(200).send({
            success:true,
            message:'Profile Updated Successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error)

    }
}


export const getOrdersControllers=async(req,res)=>{
   try {
    const orders = await orderModel.find({buyer:req.user._id}).populate('products','-photos').populate('buyer','name')

    res.json(orders)
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error while getting Orders',
        error
    })
   }
}
export const getAllOrdersControllers=async(req,res)=>{
   try {
    const orders = await orderModel.find({}).populate('products','-photosx').populate('buyer','name')

    res.json(orders)
    // console.log(orders)
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error while getting Orders',
        error
    })
   }
}

export const orderStatusController=async(req,res)=>{
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId,{status}, {new:true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting Orders',
            error
        })
    }
}