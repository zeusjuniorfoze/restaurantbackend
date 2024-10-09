//Import
let express = require('express')
let userCrtls = require('../controllers/usersCrtls')

// Routes
exports.router = (function(){
    let userRouter = express.Router()

    //user route
    userRouter.post('/register/', userCrtls.register);
    userRouter.post('/login/', userCrtls.login);
 
    
    
    return userRouter
})()