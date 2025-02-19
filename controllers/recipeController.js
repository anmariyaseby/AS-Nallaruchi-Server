const recipe = require('../models/recipeModel')

// add recipe
exports.addRecipeController=async(req,res)=>{
    console.log(`Inside AddrecipeController`)
    const userId=req.userId
    console.log(userId);
    const {recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink}=req.body
    const recipephoto=req.file.filename
    console.log(recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipephoto)
    try{
        const existingRecipe=await recipe.findOne({recipeLink})
        if(existingRecipe){
            res.status(406).json("Recipe Already Exist in our Collection....Please Upload new one!!!")
        }else{
            const newRecipe=new recipe({
                recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipephoto,userId
            })
            await newRecipe.save()
            res.status(200).json(newRecipe)
        }
    }catch(err){
        res.status(401).json(err)
    }
}
// get recipeat home page
exports.homepageRecipeController=async(req,res)=>{
    console.log(`Inside homePageRecipeController`)
    try{
        const allHomeRecipe=await recipe.find().limit(3)
        res.status(200).json(allHomeRecipe)
    }catch(err){
        res.status(401).json(err)
    }
}
// get all recipe in explore page
exports.allRecipeController=async(req,res)=>{
    console.log(`Inside allRecipeController`)
    const searchKey=req.query.search
    console.log(searchKey)
    const query={
        recipeName:{
            $regex:searchKey,$options:'i'
        }
    }
    
    try{
        const allRecipe=await recipe.find(query )
        res.status(200).json(allRecipe)
    }catch(err){
        res.status(401).json(err)
    }
}
// get recipe in dashboard-need authorization
exports.userRecipeController=async(req,res)=>{
    console.log(`Inside userRecipeController`)
    const userId=req.userId
    try{
        const allRecipe=await recipe.find({userId})
        res.status(200).json(allRecipe)
    }catch(err){
        res.status(401).json(err)
    }
}
// edit recipe
exports.editRecipeController=async(req,res)=>{
    console.log(`Inside editRecipeController`)
    const id=req.params.id
    const userId=req.userId
    const {recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipephoto}=req.body
    const reUploadRecipeImg=req.file?req.file.filename:recipephoto
    
    try{
        const editRecipe=await recipe.findByIdAndUpdate({_id:id},{recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipephoto:reUploadRecipeImg,userId},{new:true})
        await editRecipe.save()
        res.status(200).json(editRecipe)
    }catch(err){
        res.status(401).json(err)
    }
}
// delete recipe
exports.deleteRecipeController=async(req,res)=>{
    console.log(`inside deleteRecipeController`)
    const {id}=req.params
    try{
        const deleterecipe=await recipe.findByIdAndDelete({_id:id})
        res.status(200).json(deleterecipe)
    }catch(err){
        res.status(401).json(err)
    }
}
