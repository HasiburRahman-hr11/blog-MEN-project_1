const router = require('express').Router();
const {
    dashboardGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    profileGetController,
    bookmarksGetController,
    commentsGetController
} = require('../controllers/dashboardController');

const {
    unAuthenticatedUser
} = require('../middlewares/authMiddlewares');
const profileValidator = require('../validator/dashboard/profileValidator');


// Dashboard Route
router.get('/' , unAuthenticatedUser , dashboardGetController);

// Profile Route
router.get('/create-profile' , unAuthenticatedUser , createProfileGetController);
router.post('/create-profile' , unAuthenticatedUser , profileValidator , createProfilePostController);


router.get('/edit-profile' , unAuthenticatedUser , editProfileGetController);
router.post('/edit-profile' , unAuthenticatedUser , profileValidator , editProfilePostController);


// Profile Route
router.get('/profile' , unAuthenticatedUser , profileGetController);

// bookmarks Route
router.get('/bookmarks' , unAuthenticatedUser , bookmarksGetController);


// comments Route
router.get('/comments' , unAuthenticatedUser , commentsGetController);

module.exports = router;