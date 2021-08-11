const {body} = require('express-validator');
const User = require('../../models/User');

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Email is required!')
        .custom( async (email)=>{
            let user = await User.findOne({email})
            if(!user){
                return Promise.reject('Invalid Credentials!')
            }
        })
        .normalizeEmail()
    ,
    body('password')
        .not().isEmpty().withMessage('Password is required!')

]