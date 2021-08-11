const {body} = require('express-validator');
const validator = require('validator');

function linkValidator(value){
    if(value){
        if(!validator.isURL(value)){
            throw new Error('Please provide a valid url!')
        }
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name is required!')
        .isLength({max:50}).withMessage('Max Length 50 Charecters!')
        .trim()
    ,
    body('title')
        .not().isEmpty().withMessage('Title is required!')
        .isLength({max:150}).withMessage('Max Length 150 Charecters!')
        .trim()
    ,
    body('bio')
        .not().isEmpty().withMessage('Bio is required!')
        .isLength({max:500}).withMessage('Max Length 500 Charecters!')
        .trim()
    ,
    body('website')
        .custom(linkValidator)
    ,
    body('facebook')
        .custom(linkValidator)
        ,
    body('twitter')
        .custom(linkValidator)
    ,
    body('github')
        .custom(linkValidator)
];