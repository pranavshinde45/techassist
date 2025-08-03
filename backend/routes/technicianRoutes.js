const express=require("express")
const techRouter=express.Router();
const {technicianController}=require("../controller/technicianController");
const { validateTechnician, isOwner, authMiddleware } = require("../middleware");

techRouter.post("/:shopId/technicians",authMiddleware,isOwner,validateTechnician,technicianController.createTechnician)
techRouter.get("/:shopId/technicians",technicianController.getAll)
techRouter.get("/:shopId/technicians/:technicianId",technicianController.getTechnician)
techRouter.put("/:shopId/technicians/:technicianId",validateTechnician,technicianController.updateTechnician)
techRouter.delete("/:shopId/technicians/:technicianId",technicianController.deleteTechnician)
module.exports=techRouter;