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
        next();
    } catch (error) {
        res.status(400).json(error);
    }
}

const checkAdmin = (req,res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        if(!token){
            return res.status(400).json('err','token is not valid');
        }
        
    } catch (error) {
        
    }
    console.log(token);

}

module.exports = {authUser};
