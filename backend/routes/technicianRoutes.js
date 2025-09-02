const express=require("express")
const techRouter=express.Router();
const {technicianController}=require("../controller/technicianController");
const { validateTechnician, isOwner, authMiddleware } = require("../middleware");

techRouter.post("/:shopId/technicians",authMiddleware,isOwner,validateTechnician,technicianController.createTechnician)
techRouter.get("/:shopId/technicians",authMiddleware,isOwner,technicianController.getAll)
techRouter.get("/:shopId/technicians/:technicianId",authMiddleware,isOwner,technicianController.getTechnician)
techRouter.put("/:shopId/technicians/:technicianId",authMiddleware,isOwner,validateTechnician,technicianController.updateTechnician)
techRouter.delete("/:shopId/technicians/:technicianId",authMiddleware,isOwner,technicianController.deleteTechnician)
module.exports=techRouter;