
const Listing = require("../Models/listing")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

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

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({})
    res.render("Listings/index", { allListings })
    
  } catch (err) {
    console.error(err)
    res.status(500).send("Unable to load listings")
  }
}

module.exports.show =  async (req, res) => {
  const { id } = req.params
  const listing = await Listing.findById(id).populate({
    path:"reviews",populate:{
path:"author"
    }
  }).populate("owner")
  if(!listing){
    req.flash("error","Listing you try to access does not exist")
    return res.redirect("/listings");

  }
  console.log(listing)
  res.render("Listings/show", { listing })
}

module.exports.create = async (req, res) => {
 if (!req.file) {
  req.flash("error", "Please select an image")
  return res.redirect("/listings/new")
 }

 const  url = req.file.path
 const filename = req.file.filename
 console.log(url,"...",filename)

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id
  newListing.image = {url, filename}
  await newListing.save();
  req.flash("success","New listing created")
  res.redirect("/listings");
}

module.exports.edit = async (req, res, next) => {
  const { id } = req.params
  
  const listings = await Listing.findById(id)
  if(!listings){
    req.flash("error","Listing you try to access does not exist")
    return res.redirect("/listings");

  }
  let originalimageUrl = listings.image.url
  originalimageUrl.replace("/upload", "/upload/w_250")

  res.render("Listings/edit", { listings,originalimageUrl })
}

module.exports.update = async (req, res, next) => {
  const { id } = req.params
  
  const listingData = normalizeListingData(req.body.listing)

 
  let listing = await Listing.findById(id)
  if(! listing.owner._id.equals(req.user._id)){
    req.flash("error","You are not the owner of the listing")
    return res.redirect(`/listings/${id}`)
  }
  
  if(req.file){
    const url= req.file.path
  const filename = req.file.filename
   listingData.image = {url,filename}
  }
  await Listing.findByIdAndUpdate(id, listingData)
  if(req.file){
    const url= req.file.path
  const filename = req.file.filename
   listing.image = {url,filename}
   await listing.save()
  }
  req.flash("success"," listing updated")
  res.redirect(`/listings/${id}`)
}

module.exports.destroy = async (req, res, next) => {
  const { id } = req.params
  const deletelisting = await Listing.findByIdAndDelete(id)
  req.flash("success"," listing deleted")
  res.redirect("/listings")
  console.log(deletelisting)
}