const recipe = require('../models/recipeModel')
const User=require('../models/useModel')

// add recipe
exports.addRecipeController=async(req,res)=>{
    console.log(`Inside AddrecipeController`)
    const userId=req.userId
    console.log(userId);
    
    const {recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipecategory}=req.body
    const recipephoto=req.file.filename
    console.log(recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipephoto,recipecategory)
    console.log(req.body);
    try{
        const existingRecipe=await recipe.findOne({recipeLink})
        if(existingRecipe){
            res.status(406).json("Recipe Already Exist in our Collection....Please Upload new one!!!")
        }else{
            const user=await User.findById(userId)
            if(user){
                const newRecipe=new recipe({
                    recipeName,recipeIngredients,recipeOverView,recipeDescription,recipeLink,recipephoto,recipecategory,userId,userName:user.username,userProfilePic:user.profilePic
                })
                await newRecipe.save()
                res.status(200).json(newRecipe)
                console.log(newRecipe);
            }else{
                res.status(404).json("user not found")
            }
            
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
// get category
exports.getRecipebycategory = async (req, res) => {
    console.log("Inside getRecipebycategory");
    const {recipecategory}=req.body
    try {
        const category = req.params.category; // Get category from URL parameter
        console.log("Category received:", category);
        
        const categoryRecipes = await recipe.find({ recipecategory : category });

        if (categoryRecipes.length === 0) {
            return res.status(404).json({ message: "No recipes found for this category." });
        }

        res.status(200).json(categoryRecipes);
    } catch (err) {
        console.error("Error fetching category recipes:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};
// likes in recipe
// likes in recipe
exports.likeRecipe = async (req, res) => {
    console.log("Inside likeRecipeController");
    const userId = req.userId;
    const { id } = req.params; // Recipe ID from URL params

    try {
        const likedRecipe = await recipe.findById(id);
        if (!likedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Toggle like/unlike
        if (likedRecipe.likedUsers.includes(userId)) {
            likedRecipe.likes -= 1; // Unlike (decrement)
            likedRecipe.likedUsers = likedRecipe.likedUsers.filter(user => user !== userId);
        } else {
            likedRecipe.likes += 1; // Like (increment)
            likedRecipe.likedUsers.push(userId);
        }

        await likedRecipe.save();
        res.status(200).json({ message: "Like updated", likes: likedRecipe.likes });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
// dislike recipe
exports.dislikeRecipe = async (req, res) => {
    console.log("Inside dislikeRecipeController");
    const userId = req.userId;
    const { id } = req.params; // Recipe ID from URL params

    try {
        const dislikedRecipe = await recipe.findById(id);
        if (!dislikedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Toggle like/unlike
        if (dislikedRecipe.dislikedUsers.includes(userId)) {
            dislikedRecipe.dislikes -= 1; // Unlike (decrement)
            dislikedRecipe.dislikedUsers = dislikedRecipe.dislikedUsers.filter(user => user !== userId);
        } else {
            dislikedRecipe.dislikes += 1; // Like (increment)
            dislikedRecipe.dislikedUsers.push(userId);
        }

        await dislikedRecipe.save();
        res.status(200).json({ message: "Like updated", dislikes: dislikedRecipe.dislikes });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};