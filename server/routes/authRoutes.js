const express = require('express');
const router = express.Router();
const {authUser} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {registerUser, loginUser, getUserProfile, updateUserProfile, uploadimage} = require('../controllers/authController')

router.get('/login',loginUser);
router.get('/profile',authUser,getUserProfile);
router.post('/register',registerUser);
router.post('/updateprofile',authUser,updateUserProfile);

router.post('/upload-image',upload.single("image"),(req,res) => {
    if(!req.file){
        return res.status(400).json({message: "No file uploaded"});
    }


    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({imageURL});
});

module.exports = router;