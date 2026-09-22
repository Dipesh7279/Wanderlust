const mongoose = require("mongoose")
const initdata = require("./data.js")
const Listing = require("../Models/listing.js")

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust'

async function main() {
  await mongoose.connect(MONGO_URL)
  console.log("connected to db")

  const existingListings = await Listing.countDocuments()
  if (existingListings > 0 && process.env.RESET_DATABASE !== "true") {
  await Listing.updateMany(
    { owner: { $exists: false } },
    { $set: { owner: "6aaa3156beb4a901890bf2aa" } }
  )

  console.log("owners added to existing listings")
  await mongoose.connection.close()
  return
}
  

  if (process.env.RESET_DATABASE === "true") {
    await Listing.deleteMany({})
  }
    initdata.data =initdata.data.map((obj)=>({...obj,owner:'6aaa3156beb4a901890bf2aa'}))
  await Listing.insertMany(initdata.data)
  console.log("data was initialized")
  await mongoose.connection.close()
}

main().catch((err) => {
  console.error(err)
})