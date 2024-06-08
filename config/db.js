const mongoose = require('mongoose')
const configureDb = async() =>{
    try{
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/blog-app')
        console.log('connected to db')
    }catch(err){
        console.log(err)
    }
}
module.exports = configureDb