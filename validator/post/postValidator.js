const {body} = require('express-validator');

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title is required!')
        .isLength({max:350}).withMessage('Max Length 350 Charecters!')
        .trim()
    ,
    body('body')
        .not().isEmpty().withMessage('Please add some content!')
]