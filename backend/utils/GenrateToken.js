const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
require("dotenv").config();

const generateToken = async (uid,remember)=>{

    const secret = process.env.JWT_SECRET;
    const token =  jwt.sign({id:uid},secret,{expiresIn:"1d"});
    let refreshToken = null
    if(remember){
        refreshToken =  jwt.sign({id:uid},secret,{expiresIn:"30d"});
        await  User.findByIdAndUpdate(uid,{refreshToken:refreshToken,token:token})
    }else{
        await  User.findByIdAndUpdate(uid,{token:token})
    }
    return {token,refreshToken}

}

module.exports = generateToken