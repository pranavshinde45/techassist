const { userController } = require("../controller/userController");
const User=require("../model/userModel")
const express=require("express")
const userRouter=express.Router();


userRouter.post("/signup",userController.signup)
userRouter.post("/login",userController.login)
userRouter.get("/userProfile/:id",userController.getUser)
userRouter.put("/updateProfile/:id",userController.updateUser)
userRouter.delete("/deleteProfile/:id",userController.deleteUser)

module.exports=userRouter;