const Review = require("../Models/review")
const Listing = require("../Models/listing")

module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    throw new ExpressError(404, "Listing not found")
  }

  const comment = req.body.review.comment.trim()
  if (!comment) {
    throw new ExpressError(400, "Comment is required")
  }

  const newReview = new Review({
    ...req.body.review,
    comment
  })
newReview.author = req.user._id
console.log(newReview)
  listing.reviews.push(newReview)
  await newReview.save()
  await listing.save()
  req.flash("success","Review created")
  res.redirect(`/listings/${listing._id}`)
}


module.exports.deleteReview =async (req, res) => {
  const { id, reviewId } = req.params
  const listing = await Listing.findById(id)
  if (!listing) {
    throw new ExpressError(404, "Listing not found")
  }

  listing.reviews.pull(reviewId)
  await listing.save()
  await Review.findByIdAndDelete(reviewId)
  req.flash("success","Review deleted")
  res.redirect(`/listings/${id}`)
}