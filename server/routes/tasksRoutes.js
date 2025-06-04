const express = require('express');
const router = express.Router();
const {authUser,adminOnly} = require('../middleware/authMiddleware');
const { getDashboardData, getTask, getTaskById, getUserDashboardData, createTask, deleteTask, updateTask, updateTaskStatus, updateTaskCheckList } = require('../controllers/taskController');

router.get('/dashboard-data',authUser,getDashboardData);
router.get('/user-dashboard-data',authUser,getUserDashboardData);
router.get('/',authUser,getTask);
router.get('/:id',authUser,getTaskById);
router.post('/',authUser,adminOnly,createTask);
router.put('/:id',authUser,adminOnly,updateTask);
router.delete('/:id',authUser,adminOnly,deleteTask);
router.put('/:id/status',authUser,updateTaskStatus);
router.post('/:id/todo',authUser,updateTaskCheckList);

module.exports = router;