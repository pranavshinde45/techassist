const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { bookingSchema, reviewSchema, shopSchema, technicianSchema } = require('./schema');
const TechShop = require('./model/techshopModel');
const { Review } = require('./model/reviewModel');

const authMiddleware=async(req,res,next)=>{
    const authHeader=req.headers.authorization
    console.log("AUTH HEADER:", req.headers.authorization);
     if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded)
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error('Invalid token', err);
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
}

const checkRole=async(req,res,next)=>{
    if(req.user.role!="owner"){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'access denied,only author can create shops'})
    }
    next()
}

const validateBooking=(req,res,next)=>{
  let {error}=bookingSchema.validate(req.body);
  console.log(error);
  if(error){
    return res.status(400).json({message:"validation error"})
  }
  next();
}
const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  console.log(error);
  if(error){
    return res.status(400).json({message:"validation error"})
  }
  next()
}
const validateShop=(req,res,next)=>{
  let {error}=shopSchema.validate(req.body);
  console.log(error);
  if(error){
    return res.status(400).json({message:"validation error"})
  }
  next()
}
const validateTechnician=(req,res,next)=>{
  let {error}=technicianSchema.validate(req.body);
  console.log(error);
  if(error){
    return res.status(400).json({message:"validation error"})
  }
  next()
}

const isOwner=async(req,res,next)=>{
  const id=req.params.id||req.params.shopId;
  try{
    const shop=await TechShop.findById(id);
    if(!shop){
      return res.status(404).json({message:"shop not found"})
    }
    if(shop.owner.toString()!=req.user.id){
      return res.status(403).json({message:"Access denied,you are not owner of this shop"})
    }
    next()
  }catch(err){
    console.log(err);
    res.status(500).json({message:"internal server error"})
  }
}

const reviewAuthor=async(req,res,next)=>{
  let {reviewId}=req.params;
  try{
    const review=await Review.findById(reviewId);
    if(!review){
      return res.status(404).json({message:"no review found"})
    }
    if(req.user.id!=review.author.toString()){
      return res.status(403).json({message:"Access denied,you are not author of this review"})
    }
    next()
  }catch(err){
    res.status(500).json({message:"internal server error"})
  }
}

module.exports={authMiddleware,checkRole,validateBooking,validateReview,validateShop,validateTechnician,isOwner,reviewAuthor}