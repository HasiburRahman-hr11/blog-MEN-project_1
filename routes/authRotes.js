const router = require('express').Router();
const {
    loginGetController,
    loginPostController,
    signupGetController,
    signupPostController,
    logoutGetController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController');

const {authenticatedUser, unAuthenticatedUser} = require('../middlewares/authMiddlewares')

const signUpValidator =  require('../validator/auth/signupValidator');
const loginValidator =  require('../validator/auth/loginValidator');
const changePassValidator = require('../validator/auth/changePassValidator');

// Signup Route
router.get('/signup' , authenticatedUser , signupGetController);
router.post('/signup' , authenticatedUser , signUpValidator , signupPostController);

// Login Route
router.get('/login' , authenticatedUser , loginGetController);
router.post('/login' , authenticatedUser , loginValidator , loginPostController);


// Logout Route
router.get('/logout' , logoutGetController);

// Change Password Route
router.get('/change-password' , unAuthenticatedUser , changePasswordGetController);
router.post('/change-password' , unAuthenticatedUser , changePassValidator , changePasswordPostController);

module.exports = router;