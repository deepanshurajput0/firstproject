import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from 'fs'
import braintree from "braintree"
import orderModel from "../models/orderModel.js"

//payment gateway

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID || 'jxqyqh8nfnxhndsg',
  publicKey: process.env.BRAINTREE_PUBLIC_KEY || 'dyppw7b4qnj263tv' ,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY || 'e0466a5697e21ecc0376b82aebb94542' ,
})



export const  createProductController=async(req,res)=>{

   try {
    const {name, description,  price, category,  quantity, photo} = req.body
    const { filename } = req.file
    // validation 
    switch(true){
        case !name:
            return res.status(500).send({error:'Name is Required'})
        case !description:
            return res.status(500).send({error:'Description is Required'})
        case !price:
            return res.status(500).send({error:'Price is Required'})
        case !category:
            return res.status(500).send({error:'Category is Required'})
        case !quantity:
            return res.status(500).send({error:'Quantity is Required'})
        case !filename:
            return res.status(500).send({error:'Filname is Required '})
        
    }
    const products = new productModel({
        name,
        description,
        price,
        category,
        quantity,
        photo:filename,
        slug:slugify(name)
    })
    await products.save()
    res.status(201).send({
        success:true,
        message:'Product Created SuccessFully',
        products
    })   
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:'Error in creating product'
    })
   }
}
export const  updateProductController=async(req,res)=>{

   try {
    const {name, description,  price, category,  quantity} = req.body
    // const { filename } = req.file
    // validation 
    switch(true){
        case !name:
            return res.status(500).send({error:'Name is Required'})
        case !description:
            return res.status(500).send({error:'Description is Required'})
        case !price:
            return res.status(500).send({error:'Price is Required'})
        case !category:
            return res.status(500).send({error:'Category is Required'})
        case !quantity:
            return res.status(500).send({error:'Quantity is Required'})
        // case !filename:
        //     return res.status(500).send({error:'Filname is Required '})
        
    }
  const products = await productModel.findByIdAndUpdate(req.params.pid,{
    name,
    description,
    price,
    category,
    quantity,
    // photo:,
    slug:slugify(name)
 },{new:true})
    await products.save()
    res.status(201).send({
        success:true,
        message:'Product Updated SuccessFully',
        products
    })   
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:'Error in updating product'
    })
   }
}


// get all products 

export const getProductController=async(req,res)=>{
  try {
  const products = await productModel.find({}).populate('category').limit(12).sort({createdAt:-1})
  res.status(200).send({
    success:true,
    totalCount: products.length ,
    message:'All Products',
    products,
   
  })  
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error in getting products',
        error: error.message
    })
  }
}

// get Single Product 
export const getSingleProductController=async(req,res)=>{
  try {
  const products = await productModel.findOne({slug:req.params.slug}).populate('category')
  res.status(200).send({
    success:true,
    message:'single Product fetched',
    products,
   
  })  
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error while getting single product',
        error: error.message
    })
  }
}
export const deleteProductController=async(req,res)=>{
  try {
        await productModel.findByIdAndDelete(req.params.pid)
  res.status(200).send({
    success:true,
    message:'Product Deleted Successfully',

   
  })  
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error while deleting  product',
        error: error.message
    })
  }
}


export const productFiltersController=async(req,res)=>{
  try {
    // const { checked, radio } = req.body
    // let args ={}
    // if(checked.length > 0)
    //   args.category = checked
    // if(radio.length)
    //   args.price = {$gte: radio[0],$lte:radio[1]}
    //   const products = await productModel.find(args)
    //   res.status(200).send({
    //     success:true,
    //     products,
    //   })
    const { checked, radio } = req.body;
let args = {};

if (checked.length > 0) {
  args.category = checked;
}

if (radio.length === 2) {
  args.price = { $gte: radio[0], $lte: radio[1] };
}

const product = await productModel.find(args);
console.log('Received Request:', { checked, radio });

if (checked.length > 0) {
  console.log('Applying Category Filter:', args.category);
}

if (radio.length === 2) {
  console.log('Applying Price Filter:', args.price);
}

const products = await productModel.find(args);
console.log('Filtered Products:', products);

res.status(200).send({
  success: true,
  products,
});

    }
    catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message:'Error while Filtering Products',
        error 
      })
    }
  }
  

  export const relatedProductController=async(req,res)=>{
     try {
      const { pid, cid } = req.params
      const products = await productModel.find({
        category:cid,
        _id:{$ne:pid}
      }).select('-photo').limit(3).populate('category')
      res.status(200).send({
        success:true,
        products
      })
     } catch (error) {
      res.status(400).send({
        success:false,
        message:'Error while Filtering Products',
        error 
      })
     }
  }


  // payment gateway api

  export const braintreeTokenController=async(req,res)=>{
    try {
      gateway.clientToken.generate({}, function(err,response){
        if(err){
          res.status(500).send(err)
        }else{
          res.send(response)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }


  export const brainTreePaymentController=(req,res)=>{
    try {
      const {cart, nonce} = req.body
      let total = 0 
      cart.map( i => total += i.price)
      let newTransaction = gateway.transaction.sale({
        amount: total,
        paymentMethodNonce: nonce,
        options:{
          submitForSettlement:true
        }
      },
      function(error,result){
         if(result){
          const order = orderModel({
            products:cart,
            payment:result,
            buyer: req.user._id
          }).save()
          res.json({ok:true})
         }else{
          res.status(500).send(error)
         }
      }
      )
    } catch (error) {
      console.log(error)
    }
  }