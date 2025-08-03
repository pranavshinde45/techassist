const { StatusCodes } = require("http-status-codes");
const TechShop=require("../model/techshopModel");

const createShop = async (req, res) => {
    try {
        console.log(req.body); 
        console.log(req.file);   

        const { name, email, description, contact,latitude,longitude } = req.body;
        if (!name || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name and email are required" });
        }
        const techShopData = {
            name,
            email,
            description: description || "", 
            contact: contact || "",        
            image: req.file ? req.file.path : "",
            owner:req.user.id 
        };
          if (latitude && longitude) {
            techShopData.location = {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
        }
        const shop = new TechShop(techShopData);
        await shop.save();

        console.log("Saved Shop:", shop);
        res.status(StatusCodes.CREATED).json({ message: "Tech shop created successfully", shop });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

const getAllShops=async(req,res)=>{
    try{
        const allShops=await TechShop.find({});
        console.log(allShops);
        res.status(StatusCodes.OK).json({allShops})
    }catch(err){
        res.send(err.message)
    }
}

const getShop=async(req,res)=>{
    let {id}=req.params;
    try{
        const shop=await TechShop.findById(id).populate("technician").populate("reviews")
        if(!shop){
            return res.status(StatusCodes.NOT_FOUND).json({message:"no shop found"})
        }
        console.log(shop);
        res.json({shop})
    }catch(err){
        res.json({message:err.message})
    }
}

const updateShop = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, email, description, contact, latitude, longitude } = req.body;

        if (!name || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name and email are required" });
        }

        const updateData = {
            name,
            email,
            description: description || "",
            contact: contact || ""
        };

        if (latitude && longitude) {
            updateData.location = {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
        }

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedShop = await TechShop.findByIdAndUpdate(id, updateData, { new: true });
        console.log(updatedShop);
        res.status(StatusCodes.OK).json({ message: "Shop updated successfully", shop: updatedShop });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};


const deleteShop=async(req,res)=>{
    let {id}=req.params;
    try{
        const deletedShop=await TechShop.findByIdAndDelete(id)
         console.log(deletedShop);
        res.status(StatusCodes.OK).json({message:"shop deleted successfully"})
    }catch(err){
        res.json({message:err.message})
    }
}



const shopController={createShop,getAllShops,getShop,updateShop,deleteShop};

module.exports={shopController};