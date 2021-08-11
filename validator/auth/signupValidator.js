const {body} = require('express-validator');
const User = require('../../models/User');

module.exports = [
    body('username')
        .not().isEmpty().withMessage('Username is required!')
        .isLength({min:3 ,max:30}).withMessage('Username should be between 3 to 30 charecters!')
        .custom( async (username)=>{
            let user = await User.findOne({username})
            if(user){
                return Promise.reject('Username already exist!')
            }
            return true;
        })
        .trim()
    ,
    body('email')
        .not().isEmpty().withMessage('Email is required!')
        .custom( async (email)=>{
            let user = await User.findOne({email})
            if(user){
                return Promise.reject('Email already exist!')
            }
            return true;
        })
        .normalizeEmail()
    ,
    body('password')
        .not().isEmpty().withMessage('Password is required!')
        .isLength({min:5}).withMessage('Password is too short. Min 5 charecter')
    ,
    body('confirmPassword')
        .not().isEmpty().withMessage('Please confirm your password!')
        .custom((confirmPassword , {req})=>{
            if(confirmPassword !== req.body.password){
                throw new Error('Password does not match!')
            }
            return true;
        })
    ,
]
