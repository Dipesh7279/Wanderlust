const express = require("express")
const router = express.Router();
const multer = require("multer")

const wrapAsync= require("../utils/wrapAsync")
const ExpressError =require("../utils/ExpressError")
const {create, show, edit, update,destroy,index} = require("../controllers/listing")

const {storage} = require("../cloudconfig")
const upload = multer({ storage })

const { listingSchema } = require("../schema")

const Listing = require("../Models/listing");

const {isLoggedin,isOwner} =require("../middleware")
const{validateListing}= require("../middleware")

router.route("/")
.get(wrapAsync(index))
.post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(create)
)
/*.post(isLoggedin,validateListing, wrapAsync(create))*/

//New route
router.get("/new",isLoggedin, (req, res) => {
  res.render("Listings/new")
})

router.route("/:id")
.get(show)
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(update))
.delete(isLoggedin,isOwner,wrapAsync(destroy))

//edit route

router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(edit))

module.exports= router