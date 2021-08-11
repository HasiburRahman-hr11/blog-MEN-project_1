let {body} = require('express-validator');


module.exports = [
    body('oldPassword')
        .not().isEmpty().withMessage('This field is required!')
    ,
    body('newPassword')
        .not().isEmpty().withMessage('This field is required!')
        .isLength({min:5}).withMessage('Password is too short. Min 5 charecter')
    ,
    body('confirmPassword')
        .not().isEmpty().withMessage('This field is required!')
        .custom((password , {req})=>{
            if(password !== req.body.newPassword){
                throw new Error('Password does not match!')
            }
            return true;
        })
]