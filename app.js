const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")

const ejsMate = require("ejs-mate");

const Listing = require("./Models/listing")
const {listingSchema,reviewSchema}= require("./schema.js")

const Review = require("./Models/review.js");


const app = express()

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust'

main().then(() => {
  console.log("connected to DB")
}).catch((err) => {
  console.log(err)
})

async function main() {
  await mongoose.connect(MONGO_URL);
}

function normalizeListingData(listing = {}) {
  const listingData = { ...listing }

  if (typeof listingData.image === "string") {
    listingData.image = {
      url: listingData.image,
      filename: "listingimage"
    }
  }

  return listingData
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))



app.get("/", (req, res) => {
  res.redirect("/listings")
})

/*app.get("/testListing", async (req, res) => {
  try {
    const sampleListing = new Listing({
      title: "Villa",
      price: 1200,
      location: "Goa, India"
    })
    await sampleListing.save()
    console.log("sample was saved")
    res.send("successful testing")
  } catch (err) {
    console.error(err)
    res.status(500).send("failed to save listing")
  }

})*/

const validatelisting =  (req,res,next)=>{
  let {error}= listingSchema.validate(req.body)
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next()
  }
  }

const validateReviews =  (req,res,next)=>{
  let {error}= reviewSchema.validate(req.body)
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next()
  }
  }
  

  


//index route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({})
    res.render("Listings/index", { allListings })
  } catch (err) {
    console.error(err)
    res.status(500).send("Unable to load listings")
  }
})
//New route
app.get("/listings/new", (req, res) => {
  res.render("Listings/new")
})

//show route//

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params
  const listing = await Listing.findById(id)
  if (!listing) {
    return res.status(404).send("Listing not found")
  }
  res.render("Listings/show", { listing })
})

//create route

app.post("/listings", async (req, res) => {
  const listingData = normalizeListingData(req.body.listing)

  if (!listingData.title || listingData.title.trim() === "") {
    return res.status(400).send("Title is required")
  }

  if (!listingData.price || isNaN(listingData.price) || listingData.price <= 0) {
    return res.status(400).send("Price is required and must be greater than 0")
  }

  const newListing = new Listing(listingData)
  await newListing.save()
  res.redirect("/listings")

})

//edit route

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params
  const listings = await Listing.findById(id)
  res.render("Listings/edit", { listings })
})

//update route
app.post("/listings/:id", async (req, res) => {
  const { id } = req.params

  if (!req.body.listing) {
    await Listing.findByIdAndDelete(id)
    return res.redirect("/listings")
  }

  const listingData = normalizeListingData(req.body.listing)

  if (!listingData.title || listingData.title.trim() === "") {
    return res.status(400).send("Title is required")
  }

  if (!listingData.price || isNaN(listingData.price) || listingData.price <= 0) {
    return res.status(400).send("Price is required and must be greater than 0")
  }

  await Listing.findByIdAndUpdate(id, listingData)
  res.redirect(`/listings/${id}`)
})
// update  route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params
  const listingData = normalizeListingData(req.body.listing)

  if (!listingData.title || listingData.title.trim() === "") {
    return res.status(400).send("Title is required")
  }

  if (!listingData.price || isNaN(listingData.price) || listingData.price <= 0) {
    return res.status(400).send("Price is required and must be greater than 0")
  }

  await Listing.findByIdAndUpdate(id, listingData)
  res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params
  const deletelisting = await Listing.findByIdAndDelete(id)
  res.redirect("/listings")
  console.log(deletelisting)
})

//Reviews
//post route
app.post("/listings/:id/reviews",validateReviews, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
  const comment = req.body.review?.comment?.trim();

  if (!comment) {
    return res.status(400).send("Comment is required");
  }

  const newReview = new Review({
    ...req.body.review,
    comment
  });

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.send("new review saved")
})
)

app.listen(8080, () => {
  console.log("server is listening on port 8080")
})
