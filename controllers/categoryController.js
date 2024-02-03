import slugify from "slugify"
import categoryModel from "../models/categoryModel.js"

export const createCategoryController=async(req,res)=>{
    try {
       const { name } = req.body
       if(!name){
        return res.status(401).send({message:'name is required'})
       } 
       const extistingCategory = await categoryModel.findOne({name})
       if(extistingCategory){
        return res.status(200).send({
            success:true,
            message:'Category Already Exists'
        })
       }
       const category = await new categoryModel({name, slug: slugify(name)}).save()
       res.status(201).send({
        success:true,
        message:'new category created',
        category
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }
}

 export const updateCategoryController=async(req,res)=>{
  try {
    const {name} = req.body
    const {id} = req.params
    const category = await categoryModel.findByIdAndUpdate(id,{ name, slug:slugify(name)},{new:true})    
    res.status(200).send({
        success:true,
        message:'Category Updated Successfully',
        category
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error while updating',
        error
    })
  }
}

export const categoryController=async(req,res)=>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true, 
            message:'All categories list',
            category,

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false, 
            error,
            message:'Error while getting categories'

        })
    }
}

export const  singleCategoryController=async(req,res)=>{
  try {
    const category = await categoryModel.findOne({slug:req.params.slug})
    res.status(200).send({
        success:true,
        message:'get single category success',
        category, 
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error while getting category",
        error
    })
  }
}

export const deteleCategoryController=async(req,res)=>{
  try {
    const {id} = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
        success:true,
        message:'catgeory deleted successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'error while deleting category',
        error
    })
  }
}