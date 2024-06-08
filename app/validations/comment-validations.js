const Comment = require('../models/comment-model')
const commentValidation = {
    content:{
        in:['body'],
        exists:{
            errorMessage:"content is required"
        },
        notEmpty:{
            errorMessage:"content cannot be empty"
        },
        trim:true
    },
    post:{
        in:['params'],
        custom:{
            options: async function(value,{req}){
                const comment = await Comment.findOne({post:req.params.postId,author:req.user.id})
                if(comment){
                    throw new Error('you have already commented on this post')
                }
                return true
            }
        }
    },
    isMongoId:{
        errorMessage:"should be valid mongo Id"
    }
}
const commentEditValidation = {
    content:{
        in:['body'],
        exists:{
            errorMessage:"content is required"
        },
        notEmpty:{
            errorMessage:"content cannot be empty"
        },
        trim:true
    },
    // post:{
    //     isMongoId:{
    //         errorMessage:"should be valid mongo Id"
    //     }
    // }
}
const idValidationSchema = {
    post:{
        in:['params'],
        isMongoId:{
            errorMessage:"should be valid mongo Id"
        }
    }
}
module.exports = {commentValidation,commentEditValidation,idValidationSchema}