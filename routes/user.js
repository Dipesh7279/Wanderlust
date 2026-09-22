const express = require("express")
const router = express.Router();
const User = require("../Models/user")
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirecturl}= require("../middleware")
const {postSignup,postLogin,getlogout,userRenderform,getlogin} = require("../controllers/user")


router.route("/signup")
.get( userRenderform)
.post(postSignup)

router.route("/login")
.get(getlogin)
.post(saveRedirecturl,passport.authenticate('local',{failureRedirect:"/login",
  failureFlash:true
}),postLogin)

router.get("/logout",getlogout)

module.exports= router