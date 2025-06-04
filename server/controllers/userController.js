const Task = require('../models/taskSchema');
const User = require('../models/userSchema');



const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select("-password");

        const userWithTaskCount = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignTo: user.id,
                    progress: 'pending'
                });

                const inProgressTasks = await Task.countDocuments({
                    assignTo: user.id,
                    progress: 'pending'
                });

                const completedTasks = await Task.countDocuments({
                    assignTo: user.id,
                    progress: 'pending'
                });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                }
            })
        )

        res.status(200).json(userWithTaskCount);


    } catch (error) {
        res.status(500).json({ msg: 'server error', error: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.find({ username: req.user.username }).select("-password");
        if(!user) return res.status(400).json({msg:'user not found'});
        const pendingTasks = await Task.countDocuments({
            assignTo: user.id,
            progress: 'pending'
        });

        const inProgressTasks = await Task.countDocuments({
            assignTo: user.id,
            progress: 'pending'
        });

        const completedTasks = await Task.countDocuments({
            assignTo: user.id,
            progress: 'pending'
        });

        const userWithTaskCount = {
            ...user,
            pendingTasks,
            inProgressTasks,
            completedTasks
        }


        res.status(200).json(userWithTaskCount);
    } catch (error) {
        res.status(500).json({ msg: 'server error', error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ msg: 'server error', error: error.message });
    }
}

module.exports = { getUsers, getUserById, deleteUser };