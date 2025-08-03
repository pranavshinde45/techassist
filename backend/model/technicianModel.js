const mongoose=require("mongoose")
const {Schema}=require("mongoose")

const technicianSchema=new Schema({           
  name: {type:String},
  contact:{type:String},
  qualification:{type:String},
  techshop:{
    type:Schema.Types.ObjectId,
    ref:"TechShop"
  }
},{timestamps:true})

const Technician=mongoose.model("Technician",technicianSchema)
module.exports={Technician}