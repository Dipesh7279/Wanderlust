const mongoose = require("mongoose")
const Schema = mongoose.Schema


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String
  },

  price: {
    type:Number,
    required: true
  },
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [79.0889, 21.1466]
    }
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],owner:{
    type:Schema.Types.ObjectId,
    ref:"User"

  }

})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing
