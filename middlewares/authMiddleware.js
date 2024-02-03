import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'
// protected routes from token

export const requiredSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'JWT token is missing in the headers',
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET || 'gfjjrjfhdhefhrighirgirseo' );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid JWT token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const isAdmin =async(req,res,next)=>{
   try {
     const user = await userModel.findById(req.user._id)
     if(user.role !== 1){
         return res.status(401).send({
             success:false,
             message:'UnAuthorized Access'
         })
     }else{
         next() 
     }
   } catch (error) {
     console.log(error)
     res.status(401).send({
         success:false,
         error,
         message: 'Error in admin middleware'
     })
   }
 }
 
 