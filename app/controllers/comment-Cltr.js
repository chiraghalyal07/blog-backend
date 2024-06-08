const Comment = require('../models/comment-model')
const Post = require('../models/post-model')
const {validationResult} = require('express-validator')
const commentCltr = {}

commentCltr.create = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body
        const postId = req.params.postId
        console.log(postId)
        const comment = new Comment(body)
        comment.author = req.user.id
        comment.post = postId
        await comment.save()
        res.status(200).json(comment)

    }catch(err){
        res.status(500).json({errors:"something went wrong"})
    }
}
commentCltr.comments = async (req,res) =>{
    try{
        const postId = req.params.postId
        const comment = await Comment.find({post:postId})
        if(!comment){
            return res.status(404).json({errors:"record not found"})
        }
        res.status(200).json(comment)
    }catch(err){
        res.status(500).json({errors:"something went wrong"})
    }
}
commentCltr.update =async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const postId = req.params.postId
        const commentId = req.params.commentId
        const body = req.body
        const comment =await Comment.findOneAndUpdate({post:postId, _id:commentId},body,{new:true})
        if(!comment){
            return res.status(400).json({errors:"record not found"})
        }
        res.status(200).json(comment)
    }catch(err){
        res.status(500).json({errors:"something went wrong"})
    }
}
commentCltr.delete =async(req,res) =>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const postId = req.params.postId
        const commentId = req.params.commentId 
        const comment = await Comment.findOneAndDelete({post:postId, _id:commentId},{new:true})
        if(!comment){
            return res.status(404).json({errors:"record not found"})
        }
    }catch(err){
        res.status(500).json({errors:"something went wrong"})
    }
}
module.exports = commentCltr
// const Comment = require('../models/comment-model');
// const Post = require('../models/post-model');
// const { validationResult } = require('express-validator');
// const _ = require('lodash');

// const commentCltr = {};

// commentCltr.create = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         const postId = req.params.postId; 
//         const body = _.pick(req.body, ['content']); // in body we are picking only content
//         const comment = new Comment(body);
//         comment.author = req.user.id;
//         comment.post = postId;
//         await comment.save();        
//         const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });      
//         if (!updatedPost) {
//             return res.status(404).json({ error: 'Post not found' });
//         }
//         res.json(comment);
//     } catch (error) {
//         console.error(error); // 
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// }
// commentCltr.get = async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         // const post = await Post.findById(postId)
//         const post = await Post.findById(postId).populate({
//             path: 'comments',
//             populate: { path: 'author', select: 'username' }
//         });
//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }
//         res.json(post.comments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// };


// commentCltr.single = async (req, res) => {
//     try {
//         const { postId, commentId } = req.params;
//         // const comment = await Comment.findOne({ _id: commentId, post: postId })
//         const comment = await Comment.findOne({ _id: commentId, post: postId }).populate('author', 'username');
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }
//         res.json(comment);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// };

// commentCltr.update = async(req,res)=>{
//  try{
//     const commentId = req.params.commentId
//     const body = req.body  
//     const comment  = await Comment.findOneAndUpdate({_id:commentId,author:req.user.id},body,{new:true})
//     if (!comment) {
//         return res.status(404).json({ error: 'Comment not found' });
//     }
//     res.json(comment)
//  }
//  catch(error){
//     res.status(500).json({ error: 'Something went wrong' });
//  }
// }

// commentCltr.remove = async (req, res) => {  
//     try {
//         const commentId = req.params.commentId;
//         const postId = req.params.postId;       
//         const comment = await Comment.findById(commentId);
//         const post = await Post.findById(postId);  
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         if (comment.author.toString() === req.user.id || post.author.toString() === req.user.id) {
//             const deletedComment = await Comment.findByIdAndDelete(commentId);
//             if (!deletedComment) {
//                 return res.status(404).json({ error: 'Comment not found' });
//             }
//             await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });
//             return res.json({ message: 'Comment deleted successfully', deletedComment });
//         } else {
//             return res.status(403).json({ error: 'Unauthorized to delete this comment' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Something went wrong' });
//     }
// };


// module.exports = commentCltr;