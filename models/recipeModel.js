const mongoose = require('mongoose')

const recipeSchema= new mongoose.Schema({
    recipeName:{
        type:String,
        required:true
    },
    recipeIngredients:{
        type:String,
        required:true
    },
    recipeOverView:{
        type:String,
        required:true
    },
    recipeDescription:{
        type:String,
        required:true
    },
    recipeLink:{
        type:String,
        required:true,
        unique:true
    },
    recipephoto:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})
const recipe = mongoose.model('recipe',recipeSchema)
module.exports=recipe