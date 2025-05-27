const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: false,
        trim: true
    },

    profileImage: {
        type: String,
        required: false // can be set later
    },

    bio: {
        type: String,
        required: false,
        trim: true
    },

    token: {
        type: String,
        required: false,
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '30d'  // ⏳ Automatically deletes the document 2 days after creation
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;