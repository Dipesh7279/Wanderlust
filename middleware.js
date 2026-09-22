
const Listing = require("./Models/listing");
const ExpressError =require("./utils/ExpressError")
const Review = require("./Models/review");



const { listingSchema,reviewSchema } = require("./schema")
module.exports.isLoggedin = (req,res,next)=>{
 req.session.redirecturl= req.originalUrl
 
  if(!req.isAuthenticated()){
    req.flash("error","Login required to create listing")
    return res.redirect("/login")
  }

  next()
}

module.exports.saveRedirecturl= (req,res,next)=>{
  if(req.session.redirecturl){
  res.locals.redirecturl = req.session.redirecturl
  }

  next()
}
 

module.exports.isOwner = async(req,res,next)=>{
   const { id } = req.params
   let listing = await Listing.findById(id)
    if(! listing.owner._id.equals(req.user._id)){
      req.flash("error","You are not the owner of the listing")
      return res.redirect(`/listings/${id}`)
    }
  next()

}

module.exports.validateListing =(req,res,next)=>{
   let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400,errMsg)}else{
      next();
    };
  }

  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400, errMsg)
    }
    next()
  }

  module.exports.isReviewAuthor = async(req,res,next)=>{
   const { id,reviewId } = req.params
   let review = await Review.findById(reviewId)
    if(! review.author._id.equals(req.user._id)){
      req.flash("error","You are not the owner of the listing")
      return res.redirect(`/listings/${id}`)
    }
  next()

}
