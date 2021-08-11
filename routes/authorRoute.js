const router = require('express').Router();

const {
    authorPostGetController
} = require('../controllers/authorController');

router.get('/:userId' , authorPostGetController)

module.exports = router;
