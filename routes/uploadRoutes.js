const router = require('express').Router();
const {unAuthenticatedUser} = require('../middlewares/authMiddlewares')
const {
    profilePicsUploadController,
    removeProfilePics,
    postImageUploadController
} = require('../controllers/uploadController');

const upload = require('../middlewares/uploadMiddleware');

// Profile Picture
router.post('/profilePics' , unAuthenticatedUser , upload.single('profilePics') , profilePicsUploadController);

router.delete('/profilePics' , unAuthenticatedUser , removeProfilePics)

// Post Image
router.post('/postimage' , unAuthenticatedUser, upload.single('post-image') , postImageUploadController)

module.exports = router;