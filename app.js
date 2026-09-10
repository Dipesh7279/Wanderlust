const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")

const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync")

const ExpressError =require("./utils/ExpressError")

const {listingSchema}= require("./schema")

const Listing = require("./Models/listing");
const { error } = require("console");


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
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body._method === "string") {
    return req.body._method
  }

  if (req.query && typeof req.query._method === "string") {
    return req.query._method
  }
}))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")))

app.use(express.json());

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

const validateListing =(req,res,next)=>{
   let {error} = listingSchema.validate(req.body);
  console.log();
  if(error){
    let errMsg = error.details.map((el)=> el.message).john(",")
    throw new ExpressError(400,errMsg)}else{
      next();
    };
  }



//index route
app.get("/listings",wrapAsync(async (req, res, next) => {
  try {
    const allListings = await Listing.find({})
    res.render("Listings/index", { allListings })
  } catch (err) {
    console.error(err)
    res.status(500).send("Unable to load listings")
  }
}))
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

app.post("/listings",validateListing, wrapAsync(async (req, res) => {
 
  const listingData = req.body.listing;

  const newListing = new Listing(listingData);
  await newListing.save();

  res.redirect("/listings");
}));
  
    
  

//edit route

app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
  const { id } = req.params
  const listings = await Listing.findById(id)
  res.render("Listings/edit", { listings })
}))

//update route
app.post("/listings/:id",validateListing, wrapAsync(async (req, res, next) => {

    if (!req.body.listing){
    throw new ExpressError(400,"send valid data for listing")
  }
  const { id } = req.params

  if (!req.body.listing) {
    await Listing.findByIdAndDelete(id)
    return res.redirect("/listings")
  }

  

  await Listing.findByIdAndUpdate(id, listingData)
  res.redirect(`/listings/${id}`)
}))
// update  route
app.put("/listings/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params
  const listingData = normalizeListingData(req.body.listing)

 

  await Listing.findByIdAndUpdate(id, listingData)
  res.redirect(`/listings/${id}`)
}))

//delete route
app.delete("/listings/:id",wrapAsync(async (req, res, next) => {
  const { id } = req.params
  const deletelisting = await Listing.findByIdAndDelete(id)
  res.redirect("/listings")
  console.log(deletelisting)
}))

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"))
})
app.use((err,req,res,next)=>{
  let {statusCode=500, message="something went wrong"} =err;
res.status(statusCode).render("error.ejs",{message})
  
})

app.listen(8080, () => {
  console.log("server is listening on port 8080")
})
