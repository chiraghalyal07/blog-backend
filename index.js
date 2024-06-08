require('dotenv').config()
const cors = require ('cors')
const{checkSchema} = require('express-validator')
const configureDb = require ('./config/db')
const express = require('express')
const usersCltr = require('./app/controllers/users-cltr')
const postCltr = require('./app/controllers/post-cltr')
const commentCltr = require('./app/controllers/comment-Cltr')
const {userRegisterValidationSchema,userLoginValidationSchema} = require('./app/validations/users-validations')
const {postValidation,postEditValidation} = require('./app/validations/post-validations')
const {commentValidation,commentEditValidation,idValidationSchema} = require('./app/validations/comment-validations')
const authenticateUser = require('./app/middlewares/authentication')
const { posts } = require('./app/controllers/post-cltr')
const path = require ("path")
const upload = require ('./app/middlewares/multer')

const app = express()
const port = 3434
configureDb()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//user
app.post('/api/users/register',checkSchema(userRegisterValidationSchema),usersCltr.register)
app.post('/api/users/login',checkSchema(userLoginValidationSchema),usersCltr.login)
app.post('/api/users/upload-profile-picture', authenticateUser, upload.single('profilePicture'), usersCltr.uploadProfilePicture);
app.get('/api/users/profile',authenticateUser,usersCltr.account)
app.put('/api/users/profile',authenticateUser,usersCltr.update)
// posts
app.post('/api/posts',authenticateUser,checkSchema(postValidation),postCltr.create)
app.post('/api/posts/:id/upload-post-picture',authenticateUser,upload.single('postPicture'),postCltr.uploadPostPicture)
app.get('/api/posts',postCltr.posts)
app.get('/api/posts/myposts',authenticateUser,postCltr.myPosts)
app.get('/api/posts/:id',postCltr.single)
app.put('/api/posts/:id',authenticateUser,checkSchema(postEditValidation),postCltr.update)
app.delete('/api/posts/:id',authenticateUser,postCltr.delete)
//comments
app.post('/api/posts/:postId/comments',authenticateUser,checkSchema(commentValidation),commentCltr.create)
app.get('/api/posts/:postId/comments',commentCltr.comments)
app.put('/api/posts/:postId/comments/:commentId',authenticateUser,checkSchema(commentEditValidation),commentCltr.update)
app.delete('/api/posts/:postId/comments/:commentId',authenticateUser,commentCltr.delete)




app.listen(port,()=>{
    console.log('Server running on ',port)
})