const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync")
const ExpressError =require("../utils/ExpressError")

const {  reviewSchema } = require("../schema")
const {addReview,deleteReview} = require("../controllers/review")
 const Listing = require("../Models/listing");
const Review = require("../Models/review");

const {validateReview} = require("../middleware")

const{isLoggedin,isReviewAuthor}= require("../middleware")

router.post("/", validateReview, wrapAsync(addReview))

router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(deleteReview))


module.exports= router