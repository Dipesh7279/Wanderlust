const express = require("express")
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
              