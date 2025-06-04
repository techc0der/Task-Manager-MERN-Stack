const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },
  attachment: {
    type: [String],
    trim: true
  },

  todoChecklist: {
    type: [todoSchema], // embed todos here
    default: []
  },

  dueDate:{
    type:Date,
    required:true
  },

  createdBy:{
    type:String,
    required: true,
    trim: true
  },

  assignedTo:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true
  },

  progress: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  },
  priority:{
    type: String,
    enum: ['Low Priority' , 'Medium Priority', 'High Priority'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;