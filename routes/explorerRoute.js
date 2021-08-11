const router = require('express').Router();

const {
    getAllPostsController,
    singlePostGetController
} = require('../controllers/explorerController');



router.get('/:postId' , singlePostGetController)

router.get('/' , getAllPostsController)

module.exports =router;