const router = require('express').Router();
const {unAuthenticatedUser} = require('../middlewares/authMiddlewares');
const postValidator = require('../validator/post/postValidator');

const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController
} = require('../controllers/postController');
const upload = require('../middlewares/uploadMiddleware');



// Create Post 
router.get('/create-post' , unAuthenticatedUser , createPostGetController );
router.post('/create-post' , unAuthenticatedUser , upload.single('post-thumbnail') , postValidator , createPostPostController );


// edit post
router.get('/edit-post/:postId' , unAuthenticatedUser , editPostGetController)
router.post('/edit-post/:postId' , unAuthenticatedUser , upload.single('post-thumbnail') , postValidator , editPostPostController);


// delete post
router.get('/delete/:postId' , unAuthenticatedUser , deletePostGetController);

module.exports = router;