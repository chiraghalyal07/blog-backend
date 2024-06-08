const User = require('../models/user-model')
const userRegisterValidationSchema={
    username:{
        isString:{
            errorMessage:'username should be in String'
        },
        exists:{
            errorMessage:'username is required'
        },
        notEmpty:{
            errorMessage:'username cannot be empty'
        },
        trim:true

    },
    email:{
        exists:{
            errorMessage:'email is required'
        },
        notEmpty:{
            errorMessage:'email cannot be empty'
        },
        isEmail:{
            errorMessage:'email should be a valid format'
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email: value})
                if(user){
                    throw new Error('email is already taken')
                }else{
                    return true
                }
            }
        },
        trim:true,
        normalizeEmail:true
    },
    password:{
        exists:{
            errorMessage:'password is required'
        },
        notEmpty:{
            errorMessage:'password cannot be empty'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'password should be between 8 - 128 characters'
        },
        trim:true
    },
    bio:{
        exists:{
            errorMessage:'bio is required'
        },
        notEmpty:{
            errorMessage:'bio cannot be empty'
        },
        trim:true

    }

}
const userLoginValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email is required'
        },
        notEmpty: {
            errorMessage: 'email cannot be blank'
        },
        isEmail: {
            errorMessage: 'invalid email format'
        },
        normalizeEmail: true,
        trim: true 
    },
    password: {
        exists: {
            errorMessage: 'password is required'
        },
        notEmpty: {
            errorMessage: 'password cannot be blank'
        }, 
        isLength: {
            options: { min: 8, max: 128},
            errorMessage: 'password should be between 8 - 128 characters'
        },
        trim: true 
    }
}
module.exports= {userRegisterValidationSchema,userLoginValidationSchema}