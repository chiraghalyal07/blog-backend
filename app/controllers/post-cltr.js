const Post = require('../models/post-model')
const{validationResult} = require('express-validator')
const postCltr={}

postCltr.create = async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}) 
   }
   try{
   const body = req.body
   const post = new Post(body)
   post.author = req.user.id
   await post.save()
   res.status(200).json(post)
  }
  catch(err){
    res.status(500).json({errors:err.msg})
  }
}

postCltr.posts=async(req,res)=>{
try{
    const post=await Post.find()
   res.status(200).json(post)
    }
    catch(err){
    res.status(500).json({errors:err})
   }
}

postCltr.single=async(req,res)=>{
   try{ 
    const id=req.params.id
    const post=await Post.findById(id)
    res.status(200).json(post)
    }catch(err){
        res.status(500).json({errors:err})
    }
}

postCltr.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})
    }
    try{
          const body=req.body
          const id=req.params.id
          const post=await Post.findOneAndUpdate({author:req.user.id,_id:id},body,{new:true})
          if(!post){
            return res.status(404).json({errors:'record not found'})
          }
          res.status(200).json(post)
    }catch(err){
           res.status(500).json({errors:'somthing went wrong'})
    }
}

postCltr.delete=async(req,res)=>{
    try{
          
          const id=req.params.id
          const post=await Post.findOneAndDelete({author:req.user.id,_id:id},{new:true})
          if(!post){
            return res.status(404).json({errors:'record not found'})
          }
          res.status(200).json(post)
    }catch(err){
           res.status(500).json({errors:'somthing went wrong'})
    }
}

postCltr.myPosts=async(req,res)=>{
    try{
         const posts=await Post.find({author:req.user.id})
         if(!posts){
            return res.status(404).json({errors:'record not found'})
         }
         res.status(200).json(posts)
    }catch(err){
         res.status(500).json({errors:'somthing went wrong'})
    }
}
postCltr.uploadPostPicture = async (req, res) => {
  try {
      const postId = req.params.id;
      let postPicture = req.file.path; // Replace backslashes with forward slashes
      postPicture = postPicture.replace(/\\/g, '/');
      
      // Find the post by ID and update the postPicture field
      const post = await Post.findByIdAndUpdate(postId, { postPicture }, { new: true });
      
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Post updated successfully', post });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports=postCltr