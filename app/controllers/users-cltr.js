const User = require('../models/user-model')
const {validationResult} = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt=require('jsonwebtoken')
const usersCltr = {}
usersCltr.register = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    try{
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password,salt)
        const user = new User(body)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)
    }catch(err){
        return res.status(500).json({errors:'something went wrong'})
    }

}
usersCltr.login = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    try{
        const user = await User.findOne({email:body.email})
        if(user){
            const isAuth = await bcryptjs.compare(body.password,user.password)
            if(isAuth){
                const tokenData = {
                    id:user._id
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET,{expiresIn:'7d'})
               return res.json({token:token})
            }
            return res.status(404).json({errors:'Invalid Email / Password'})
        }
        res.status(404).json({errors:'Invalid Email / Password'})
    }catch(err){
        console.log(err)
        res.status(500).json({errors:'Something went wrong..!'})
    }
}
usersCltr.account = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    }catch(err){
        res.status(500).json({errors:'Something went Wrong..!'})
    }
}
usersCltr.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
     try{
        if(body.password){
          const salt=await bcryptjs.genSalt()
          const hash=await bcryptjs.hash(body.password,salt)
          body.password=hash
          console.log(hash)
        }
          console.log("Update Body:",body)
          const user=await User.findOneAndUpdate({_id:req.user.id},body,{new:true})
          res.status(200).json(user)
     }catch(err){
         console.log(err)
         res.status(400).json({errors:'somthing went wrong'})
     }
 }
usersCltr.checkEmail= async(req,res)=>{
    const email = req.query.email
    const user = await User.findOne({email:email})
    if(user){
        res.json({"is_email_registered":true})
    }else{
        res.json({"is_email_registered":false})
    }
}
usersCltr.uploadProfilePicture = async (req, res) => {
    try {
        console.log('Uploaded file',req.file); // Log the uploaded file details
        const userId = req.user.id;
        let profilePicture = req.file.path; // Replace backslashes with forward slashes

        profilePicture = profilePicture.replace(/\\/g, '/');
        console.log('Updating user:', userId, 'with profile picture:', profilePicture);
        const user = await User.findByIdAndUpdate(userId, { profilePicture: profilePicture }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile picture updated successfully', user });
    } catch (err) {
        console.error('Error updating profile picture:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
module.exports =usersCltr