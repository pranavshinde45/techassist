const { StatusCodes } = require("http-status-codes");
const { Technician } = require("../model/technicianModel");
const TechShop = require("../model/techshopModel");

const getAll = async (req, res) => {
    try {
        const { id } = req.params;
        const technicians = await Technician.find({ shop: id}); // 🔥 Filter here

        if (technicians.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No technicians found" });
        }

        console.log(technicians);
        res.status(StatusCodes.OK).json({ message: technicians });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}


const createTechnician = async (req, res) => {
    let {shopId} = req.params;
    console.log(shopId)
    let {name, contact, qualification} = req.body;
    if (!name || !contact || !qualification) {
        return res.json({ message: "provide necessary details" });
    }
    try{
        const shop = await TechShop.findById(shopId);
        console.log(shop)
        const newTechnician = new Technician({
            name: name,
            contact: contact,
            qualification: qualification
        })
        shop.technician.push(newTechnician._id);
        await newTechnician.save();
        await shop.save()
        res.status(StatusCodes.CREATED).json({ message: "technician created successfully" })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}

const getTechnician=async(req,res)=>{
    let {technicianId }=req.params;
    try{
        const technician=await Technician.findById(technicianId);
        if(!technician){
            return res.status(StatusCodes.NOT_FOUND).json({message:'no technician found'})
        }
        console.log(technician);
        res.status(StatusCodes.OK).json({technician})
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
}

const updateTechnician=async(req,res)=>{
    let {technicianId}=req.params;
    let {name,contact,qualification}=req.body
    try{
        const update=await Technician.findByIdAndUpdate(technicianId,{$set:{name:name,contact:contact,qualification:qualification}})
        console.log(update);
        res.status(StatusCodes.OK).json({message:"technician updated successfully"})
    }catch(err){
        console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"})
    }
}

const deleteTechnician=async(req,res)=>{
    let {technicianId,shopId}=req.params;
    try{
        const deleted=await Technician.findByIdAndDelete(technicianId);
        console.log(deleted);

        await TechShop.findByIdAndUpdate(shopId,{$pull:{technician:technicianId}})
        res.json({message:"technician deleted successfully"})
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
}


const technicianController = { getAll,createTechnician,getTechnician,updateTechnician,deleteTechnician}
module.exports = { technicianController }