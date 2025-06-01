const user = require('../models/userSchema');
const bcrypt = require('bcrypt');
const codeSchema = require('../models/adminCodeSchema');
const {profileImage} = require('../globalVariable');
const jwt = require('jsonwebtoken');

const generateToken = (username) => {
    return jwt.sign(
        {
            id: username,
        },                        // payload
        process.env.TokenKey || 'Indus University',   // secret key
        { expiresIn: '30d' }                  // token lifespan
    );
};
// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        const role = 'user';

        const alreadyexist = await user.findOne({ username: username });
        if (alreadyexist) return res.status(400).json({ msg: "Username already exists" });

        const emailExist = await user.findOne({ email: email });
        if (emailExist) return res.status(400).json({ msg: "Email already registered" });
        const userDetail = user({
            name: name,
            email: email,
            password: password,
            role: role,
            username: username,

        })
        const registerUser = await userDetail.save();
        if (userStatus) {
            return res.status(200).json({ msg: "User registered successfully", user:{
                username: registerUser.username
            }  });
        }
        else return res.status(400).json({ msg: "Failed to save user in database" });

    } catch (error) {
        res.status(500).json(error);
    }
};

const generateCode = (digits) => {
    const min = Math.pow(10, digits - 1);  // e.g., 1000 for 4-digit
    const max = Math.pow(10, digits) - 1;  // e.g., 9999 for 4-digit
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateCodeForAdminRegistration = async (req, res) => {
    try {
        const user = req.body;
        const checkCode = codeSchema.findOne(user.username);

    } catch (error) {

    }
};

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const role = user;

    } catch (error) {

    }
};

// Log in a user
const loginUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const userRecord = username 
            ? await user.findOne({ username }) 
            : await user.findOne({ email });

        if (!userRecord) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, userRecord.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // ✅ Only now generate and assign token
        if (!userRecord.token) {
            userRecord.token = generateToken(userRecord.username);
            await userRecord.save(); // Save only if token was updated
        }

        return res.status(200).json({
            msg: 'Login successful',
            user:{
                id: userRecord.id,
                username: userRecord.username,
                email: userRecord.email,
                profileImage : userRecord.profileImage,
                token: userRecord.token
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ msg: "Internal server error", error });
    }
};


// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const { username } = req.user;

        const getProfile = await user.findOne({ username });

        if (!getProfile) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({
            msg:'Profile successfully updated',
            user:{
                name: getProfile.name,
                username: getProfile.username,
                email: getProfile.email,
                phone: getProfile.phone,
                role: getProfile.role,
                bio: getProfile.bio,
                image: getProfile.profileImage
            }
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        let { name, email, password, username, phone, bio } = req.body;
        const userDataFromToken = req.user;

        const checkValidUser = await user.findOne({ username: userDataFromToken.username });
        if (!checkValidUser) {
            return res.status(400).json({ msg: "User is not valid" });
        }

        if (username && username !== checkValidUser.username) {
            const alreadyexist = await user.findOne({ username });
            if (alreadyexist) {
                return res.status(400).json({ msg: "This username already exists" });
            }
        }

        if(username && username != checkValidUser.username) checkValidUser.token = generateToken(checkValidUser.username);
        
        checkValidUser.name = name || checkValidUser.name;
        checkValidUser.email = email || checkValidUser.email;
        checkValidUser.username = username || checkValidUser.username;
        checkValidUser.phone = phone || checkValidUser.phone;
        checkValidUser.bio = bio || checkValidUser.bio;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            checkValidUser.password = hashedPassword;
        }

        const userStatus = await checkValidUser.save();

        return res.status(200).json({
            msg: "User updated successfully",
            user: {
                name: userStatus.name,
                email: userStatus.email,
                username: userStatus.username,
                phone: userStatus.phone,
                bio: userStatus.bio,
                token: userStatus.token
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const uploadimage = async (req,res)=>{
    try {
        const {username} = req.user;
        const imageURL = req.imageURL;
        if(!imageURL) return res.status(400).json({msg:'profile image global is not defined'});
        const updateUser = await user.findOne({ username: username });
        console.log(username);
        updateUser.profileImage = imageURL;
        const updatedUser = updateUser.save();
        res.status(200).json({
            msg:'Profile Image uploaded successfully',
            imageURL:updatedUser.profileImage
        })
    } catch (error) {
        
    }
}
module.exports = { generateToken, registerUser, loginUser, getUserProfile, updateUserProfile ,uploadimage}; 