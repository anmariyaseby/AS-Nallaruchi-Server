const users = require('../models/useModel')
const jwt = require('jsonwebtoken')
const recipe = require('../models/recipeModel')

// register
exports.registerController=async (req,res)=>{
    console.log(`inside register`);
    console.log(req.body);
    const {username,email,password}=req.body
    try{
        const existingUser= await users.findOne({email})
        if(existingUser){
           return res.status(406).json('Already existing user....please login!!!')
        }else{
            const newUser= new users({
                username,email,password,profilePic:''
            })
            await newUser.save()
           return res.status(200).json(newUser)
        }
    }catch(err){
       return res.status(401).json(err)
    }
}
// login
exports.loginController=async (req,res)=>{
    console.log('inside login controller')
    const {email,password}=req.body
    console.log(email,password)
    try{
        const existingUser= await users.findOne({email,password})
        if(existingUser){
            // token generation
            const token=jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)
            res.status(200).json({
                user:existingUser,token
            })
        }else{
            res.status(404).json("Incorrect Email/Password")
        }
    }catch(err){
        res.status(401).json(err)
    }
}
// profile updation
exports.editUserController = async (req, res) => {
    console.log("Inside editUserController");
    const { username, email, password, profilePic } = req.body;
    const uploadProfilePic = req.file ? req.file.filename : profilePic;
    const userId = req.userId;

    try {
        const updatedUser = await users.findByIdAndUpdate(
            { _id: userId },
            { username, email, password, profilePic: uploadProfilePic },
            { new: true }
        );

        await updatedUser.save();
        await recipe.updateMany(
            { userId: userId },  // Find recipes by userId
            { $set: { userProfilePic: uploadProfilePic } } // Update profile picture
        );  
        // Return updated user details in response
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(401).json(err);
    }
};
