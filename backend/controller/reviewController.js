const { StatusCodes } = require("http-status-codes");
const {Review}=require("../model/reviewModel")
const TechShop=require("../model/techshopModel")


const createReview=async(req,res)=>{
    let {shopId}=req.params;
    let {rating,comment}=req.body;
    try{
        const techShop=await TechShop.findById(shopId);
        console.log(techShop)

        const newReview=new Review({
            rating:rating,
            comment:comment
        })
        newReview.author=req.user.id
        await newReview.save();
        
        techShop.reviews.push(newReview._id)
        await techShop.save();
        res.status(StatusCodes.CREATED).json({message:"Review created successfully"});
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message})
        console.log(err)
    }
}

const getReview=async(req,res)=>{
    try{
        let {shopId}=req.params;
        const shop = await TechShop.findById(shopId).populate({path: 'reviews',populate: {path: 'author'}});
        console.log(shop)
        const shopReviews=shop.reviews;
        res.status(StatusCodes.OK).json({shopReviews})
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
} 

const deleteReview=async(req,res)=>{
    let {reviewId,shopId}=req.params;
    try{
        const deleted=await Review.findByIdAndDelete(reviewId);
        console.log(deleted)
        await TechShop.findByIdAndUpdate(shopId,{$pull:{reviews:reviewId}})
        res.status(StatusCodes.OK).json({message:'review deleted successfully'})
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
}



module.exports={createReview,deleteReview,getReview}