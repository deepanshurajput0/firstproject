import express from 'express'
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js'
import { createCategoryController, updateCategoryController, categoryController,  singleCategoryController, deteleCategoryController } from '../controllers/categoryController.js'
const router = express.Router()

router.post('/create-category', requiredSignIn, isAdmin, createCategoryController)

// update category

router.put('/update-category/:id', requiredSignIn, isAdmin, updateCategoryController)

// get all categories

router.get('/get-category',categoryController)

// get single category

router.get('/single-category/:slug', requiredSignIn, isAdmin,singleCategoryController)

router.delete('/delete-category/:id', deteleCategoryController)
export default router
