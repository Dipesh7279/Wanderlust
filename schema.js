const Joi = require('joi')

module.exports.listingSchema =Joi.object({
  title: Joi.string().required(),
 
  Description: Joi.string().required(),
  price: Joi.number().required().min(0),
  Country: Joi.string().required(),
  location: Joi.string().allow("",null).required()

})