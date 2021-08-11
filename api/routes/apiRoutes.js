const router = require('express').Router();
const {unAuthenticatedUser} = require('../../middlewares/authMiddlewares');

const {likesGetController , dislikesGetController} = require('../controllers/likeDislikeController');

const {commentPostController , replyPostController} = require('../controllers/commentController');

const {bookmarksGetController} = require('../controllers/bookmarkController');


// likeDislike
router.get('/likes/:postId' , unAuthenticatedUser , likesGetController);
router.get('/dislikes/:postId' , unAuthenticatedUser , dislikesGetController);

//comment
router.post('/comments/:postId' , unAuthenticatedUser , commentPostController);
router.post('/comments/replies/:commentId' , unAuthenticatedUser , replyPostController)

// bookmarks
router.get('/bookmarks/:postId' , unAuthenticatedUser , bookmarksGetController)

module.exports = router;