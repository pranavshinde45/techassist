const mongoose=require("mongoose")
const {Schema}=require("mongoose")

const reviewSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    rating:{type:Number},
    comment:{type:String}
},{timestamps:true})

const Review=mongoose.model("Review",reviewSchema)
module.exports={Review}