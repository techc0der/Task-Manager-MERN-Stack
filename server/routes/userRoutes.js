const { getUsers, getUserById } = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const { authUser, adminOnly } = require('../middleware/authMiddleware');

router.get('/',authUser,adminOnly,getUsers);
router.get('/:id',authUser,getUserById);

module.exports = router;