const User = require("../model/userModel")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

const signup = async (req, res) => {
    try {
        let { username, email, password,role } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email,
            role:role
        })
        const result = await newUser.save();
        const token = jwt.sign(
            { id:newUser._id, role:newUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "8h" }
        )
        res.json({ token, userId: newUser._id,role:newUser.role })
        console.log(result)
    } catch (err) {
        console.log("error during signup", err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}


const login = async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ "message": "provide all credentials" })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({ message: "user not found" })
        }
        const isMatch =await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid credentials' })
        }
        const token = jwt.sign(
            { id: user._id ,role:user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "8h" }
        )
        res.json({ token, userId: user._id,role:user.role })
    } catch (err) {
        console.log("error during signup", err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}

const getUser = async (req, res) => {
    let { id } = req.params;
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"user not found"})
        }
        console.log(user);
        res.status(StatusCodes.OK).json({user})
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}

const updateUser=async(req,res)=>{
    let {username,email,password,role}=req.body;
    let {id}=req.params;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and password required" });
    }
    try{
        const hashedPassword=await bcrypt.hash(password,10)
        const updatedUser=await User.findByIdAndUpdate(id,{$set:{username:username,password:hashedPassword,email:email,role:role}})
        console.log(updatedUser)
        res.status(StatusCodes.OK).json({updatedUser})
    }catch(err){
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}
const deleteUser=async(req,res)=>{
    let {id}=req.params;
    try{
        const deletedUser=await User.findByIdAndDelete(id);
        console.log(deletedUser);
        res.status(StatusCodes.OK).json({message:"user deleted successfully"})
    }catch(err){
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
}

const userController = { signup, login, getUser, updateUser, deleteUser}
module.exports = { userController }