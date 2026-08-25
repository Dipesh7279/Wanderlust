const mongoose = require("mongoose")
const initdata = require("./data.js")
const Listing = require("../Models/listing.js")

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust'

async function main() {
  await mongoose.connect(MONGO_URL)
  console.log("connected to db")
  await Listing.deleteMany({})
  await Listing.insertMany(initdata.data)
  console.log("data was initialized")
  await mongoose.connection.close()
}

main().catch((err) => {
  console.error(err)
})