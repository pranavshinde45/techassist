const express=require("express");
const { shopController } = require("../controller/techShopController");
const shopRouter=express.Router();
const {authMiddleware,checkRole, validateShop, isOwner}=require("../middleware");
const TechShop = require("../model/techshopModel");
const multer=require("multer")
const {storage}=require("../cloudConfig")
const upload = multer({storage });

shopRouter.get("/getAllShops",shopController.getAllShops)
shopRouter.post("/createShop",authMiddleware,checkRole,upload.single("image"),validateShop,shopController.createShop)

shopRouter.get("/getShop/:id",shopController.getShop)
shopRouter.put("/updateShop/:id",authMiddleware,isOwner,upload.single("image"),validateShop,shopController.updateShop)
shopRouter.delete("/deleteShop/:id",authMiddleware,isOwner,shopController.deleteShop)

module.exports=shopRouter;