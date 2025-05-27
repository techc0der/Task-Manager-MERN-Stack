const express = require('express');
const router = express.Router();
const {authUser} = require('../middleware/authMiddleware');
const {registerUser, loginUser, getUserProfile, updateUserProfile} = require('../controllers/authController')

router.get('/login',loginUser);
router.get('/profile',authUser,getUserProfile);
router.post('/register',registerUser);
router.post('/updateprofile',authUser,updateUserProfile);
router.post('/uploadimage');

module.exports = router;

