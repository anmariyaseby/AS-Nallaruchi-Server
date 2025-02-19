const express = require('express')
const userController = require('../controllers/userController')
const recipeController = require('../controllers/recipeController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerMiddleware=require('../middleware/multerMiddlewares')
const router = new express.Router()

// register
router.post('/register',userController.registerController)
// login
router.post(`/login`,userController.loginController)
// add recipe
router.post(`/addrecipe`,jwtMiddleware,multerMiddleware.single('recipephoto'),recipeController.addRecipeController)
// to view recipe in home page
router.get(`/homerecipe`,recipeController.homepageRecipeController)
// get all recipe
router.get('/allrecipe',jwtMiddleware,recipeController.allRecipeController)
// get all recipe in dashboard
router.get('/userrecipe',jwtMiddleware,recipeController.userRecipeController)
// put edit recipe
router.put('/recipe/:id/edit',jwtMiddleware,multerMiddleware.single('recipephoto'),recipeController.editRecipeController)
// delete recipe
router.delete(`/recipe/:id`,jwtMiddleware,recipeController.deleteRecipeController)
// edit userprofile
router.put(`/edit-user`,jwtMiddleware,multerMiddleware.single('profilePic'),userController.editUserController)
module.exports=router
