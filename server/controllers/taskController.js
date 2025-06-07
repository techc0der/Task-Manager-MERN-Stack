const taskSchema = require('../models/taskSchema');

const getTask = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};
        if (status) filter.status = status;
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await taskSchema.find(filter).populate("assignedTo", "name email profileImage");
        } else {
            tasks = await taskSchema.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email profileImage");
        }
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;

                return { ...task._doc, completedTodoCount: completedCount }
            })

        )
        const allTasks = await taskSchema.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
        )

        const pendingTasks = await taskSchema.countDocuments({
            ...filter,
            progress:"pending",
            ...(req.user.role !== 'admin' && {assignedTo: req.user._id})
        })

        const progressTasks = await taskSchema.countDocuments({
            ...filter,
            progress:"in progress",
            ...(req.user.role !== 'admin' && {assignedTo: req.user._id})
        })

        const completedTasks = await taskSchema.countDocuments({
            ...filter,
            progress:"in completed",
            ...(req.user.role !== 'admin' && {assignedTo: req.user._id})
        })
        if (tasks.length === 0) {
            return res.status(404).json({ msg: 'No tasks found for this user' });
        }
        res.status(200).json({ 
            msg: 'Task Founded',
            tasks,
            statusSummary:{
                all: allTasks,
                pendingTasks,
                progressTasks,
                completedTasks
            }
         });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await taskSchema.find({ _id: req.params.id, assignedTo: req.user._id }).populate("assignedTo", "name email profileImage");
        if (task.length === 0) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(200).json({ msg: 'Task Founded', task: task });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;
        if (!Array.isArray(todoChecklist)) {
            return res.status(400).json({ error: "todoChecklist must be an array" });
        }
        const newTask = new taskSchema({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist
        });


        await newTask.save();

        res.status(201).json({ message: "Task created", task: newTask });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await taskSchema.findOne({
            _id: req.params.id
        });

        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;
        task.attachments = attachments || task.attachments;
        if (todoChecklist && !Array.isArray(todoChecklist)) {
            return res.status(400).json({ error: "todoChecklist must be an array" });
        } else task.todoChecklist = todoChecklist || task.todoChecklist;
        await task.save();

        res.status(201).json({ message: "Task Updated", task: task });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await taskSchema.deleteOne({
            _id: req.params.id
        });
        res.status(200).json({ msg: 'Task is deleted', task: task })
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const updateTaskCheckList = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};


const getDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};


const getUserDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
}

module.exports = { getTask, getDashboardData, getUserDashboardData, getTaskById, createTask, updateTask, updateTaskCheckList, updateTaskStatus, deleteTask }



