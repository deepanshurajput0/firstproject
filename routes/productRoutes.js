import express from 'express'
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js'
import { createProductController, getProductController, getSingleProductController, deleteProductController, updateProductController, productFiltersController, relatedProductController, braintreeTokenController,brainTreePaymentController,} from '../controllers/productController.js'
// import formidable from 'express-formidable'
import multer from 'multer'

const router = express.Router()


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, `public/upload/`);
    },
    filename: function (req,file,cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage: storage})

// routes 
router.post('/create-product',requiredSignIn, upload.single('photo'),isAdmin,createProductController)

// update product
router.put('/update-product/:pid',requiredSignIn, upload.single('photo'),isAdmin,updateProductController)
// get products 
router.get('/get-product', getProductController)

// single-product
router.get('/get-product/:slug', getSingleProductController)

// delete-product

router.delete('/delete-product/:pid', deleteProductController)

// filter 

router.post('/product-filters',productFiltersController)


// similar products 

router.get('/related-product/:pid/:cid', relatedProductController)

//payment route 

router.get('/braintree/token', braintreeTokenController)

// payments

router.post('/braintree/payment',requiredSignIn,brainTreePaymentController)

// orders 



export default router



