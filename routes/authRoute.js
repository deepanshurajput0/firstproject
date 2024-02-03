import express from 'express'
import { registerController, loginController, testController, forgotPasswordController, updateProfileController} from '../controllers/authController.js'
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js'
import { getOrdersControllers, getAllOrdersControllers, orderStatusController } from '../controllers/authController.js'

const router = express.Router()

// routing

// register
router.post('/register', registerController)

// login 
router.post('/login', loginController
)
router.get('/test',requiredSignIn , isAdmin ,testController)


// forgot password

router.post('/forgot-password', forgotPasswordController)
router.get('/userauth', requiredSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

// admin route 
router.get('/adminauth', requiredSignIn, isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update profile 

router.put('/profile',requiredSignIn,updateProfileController)


router.get('/orders',requiredSignIn, getOrdersControllers)

// all orders 

router.get('/all-orders',requiredSignIn,isAdmin,getAllOrdersControllers)

// order status update 

router.put('/order-status/:orderId',requiredSignIn,isAdmin,orderStatusController)
export default router


