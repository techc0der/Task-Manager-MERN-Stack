const jwt = require('jsonwebtoken');
const user = require('../models/userSchema');
require('dotenv').config();

const authUser = async (req,res,next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        if(!token){
            return res.status(400).json('err','token is not valid');
        }
        const decode = jwt.verify(token,process.env.TokenKey);
        const verify1 = await user.findOne({username : decode.id});
        
        if(!verify1 || verify1.token != token) return res.status(400).json({msg:'token is invalid'}); 
        req.user = verify1;
        console.log(decode.id)
        next();
    } catch (error) {
        res.status(400).json(error);
    }
}

const adminOnly = (req,res,next) => {
    const accountType = req.user.role;
    try {
        if(accountType && accountType == 'admin') next();
        else res.status(400).json({msg:'failed to authentication as admin'});
    } catch (error) {
        res.status(500).json({msg:'Server error',error:error.message});
    }

}

module.exports = {authUser,adminOnly};
