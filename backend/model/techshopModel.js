const mongoose=require("mongoose")
const {Schema}=require("mongoose")
const {Review}=require("./reviewModel")
const {Technician}=require("./technicianModel")

const techshopSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    description:{type:String},
    contact:{type:String},
    image:String,
    location: {type: { type: String, enum: ['Point']},coordinates: {type: [Number]}},
    rating:{type:Number},
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    technician:[{
        type:Schema.Types.ObjectId,
        ref:"Technician"
    }],
    booking:[{
        type:Schema.Types.ObjectId,
        ref:"Booking"
    }]
},{timestamps:true})

techshopSchema.post("findOneAndDelete",async function(techShop){
    if(techShop){
        const res=await Review.deleteMany({_id:{$in:techShop.reviews}})
        const tech=await Technician.deleteMany({_id:{$in:techShop.technician}})
        console.log(res)
    }
})

const TechShop=mongoose.model("TechShop",techshopSchema)
module.exports=TechShop