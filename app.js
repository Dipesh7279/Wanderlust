const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
// other imports...

if(process.env.NODE_ENV != "production"){
require("dotenv").config()
}
const express = require("express")

const path = require("path")
const methodOverride = require("method-override")

const ejsMate = require("ejs-mate");
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./Models/user.js")

const wrapAsync= require("./utils/wrapAsync")
const ExpressError =require("./utils/ExpressError")


const { MongoStore } = require("connect-mongo")

const { listingSchema, reviewSchema } = require("./schema")

const reviewsRouter= require("./routes/review.js")
const listingsRouter= require("./routes/listing.js")
const userRouter =require("./routes/user.js")




const Listing = require("./Models/listing");
const Review = require("./Models/review");
const { configDotenv } = require("dotenv")




const app = express()


const dburl = process.env.ATLAS_DB

main().then(() => {
  console.log("connected to DB")
}).catch((err) => {
  console.log(err)
})

async function main() {
  await mongoose.connect(dburl);
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

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
     secret:process.env.SECRET,
  },
  touchAfter: 24*3600
})


store.on("error",()=>{
console.log()
})


const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
saveUninitialized:true,
expires:Date.now() +7*24*60*60*1000,
maxAge:7*24*60*60*1000,
httpOnly:true
}




app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success= req.flash("success")
  res.locals.error= req.flash("error")
  res.locals.currUser=req.user
  next();
}

)

app.get("/", (req, res) => {
  res.redirect("/listings")
})
app.get("/demouser", async(req,res)=>{
  let fakeuser =new User({
    email: "gtgmail.com",
    username: "g"
  })
  let registeredUser =await User.register(fakeuser,"heycro")
  res.send(registeredUser)

})
app.use("/",userRouter)
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
//reviews


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
