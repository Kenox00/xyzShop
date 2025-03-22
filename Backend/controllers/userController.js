const JWT_SECRET = 'your_jwt_secret_key';
const User = require("../models/user")
const jwt = require('jsonwebtoken')


const createToken =  (_id) => {
    return jwt.sign({_id}, JWT_SECRET, {expiresIn: '3d'})
}

const logInUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id)
        res.status(200).json({ email, token })
    }catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signUpUser = async (req, res) => {
    const { email, password } = req.body
    try {   
        const user = await User.signup(email, password);
        
        const token = createToken(user._id)
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { logInUser, signUpUser }