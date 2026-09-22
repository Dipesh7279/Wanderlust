
const User = require("../Models/user")

module.exports.userRenderform =  (req, res) => {
	res.render("user/signup.ejs")
}

module.exports.getlogin = (req,res)=>{
  res.render("user/login.ejs")
}

module.exports.postSignup =  async (req, res,next) => {

  try{
    const { username, email, password } = req.body
  const newUser = new User({ username, email })
  const registeredUser = await User.register(newUser, password)
  req.login(registeredUser,(err)=>{
    if(err){
      next(err)
  }{
    req.flash("success", "User registered successfully")
  res.redirect("/listings")
  }
  })
  console.log(registeredUser)
  
  }catch(e){
    console.error(e)
    req.flash("error", e.message)
    res.redirect("/signup")
  }
  
}
module.exports.postLogin = async(req,res)=>{
  req.flash("success","login successful")
res.redirect(res.locals.redirecturl || "/listings")
}

module.exports.getlogout = (req,res,next)=>{
	req.logout((err)=>{
		if(err){
			return next(err)

		}else{
			req.flash("success","User Logged out successfully")
			 res.redirect("/listings")
		}
	})
}
