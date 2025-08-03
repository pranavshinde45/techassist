const mongoose=require("mongoose")
const {Schema}=require("mongoose")

const bookingSchema=new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    shopId:{
        type:Schema.Types.ObjectId,
        ref:"TechShop"
    },
    contact:{type:String},
    issue:{type:String},
    serviceType:{type:String,enum:["remote","inPerson"]},
    sessionLink: { type: String }, 
    sessionTime: { type: Date },
    sessionId:{type:String}
},{timestamps:true})

const Booking=mongoose.model("Booking",bookingSchema)

module.exports=Booking;