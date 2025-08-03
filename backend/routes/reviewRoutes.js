const express=require("express");
const  {getReview,createReview,deleteReview } = require("../controller/reviewController");
const reviewRouter=express.Router();
const {authMiddleware, validateReview, reviewAuthor}=require("../middleware")

reviewRouter.get("/:shopId/review",getReview)
reviewRouter.post("/:shopId/review",authMiddleware,validateReview,createReview)
reviewRouter.delete("/:shopId/review/:reviewId",authMiddleware,reviewAuthor,deleteReview)

module.exports=reviewRouter;