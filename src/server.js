const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const endpointsList = require("express-list-endpoints")

const server = express()
server.use(helmet())
server.use(cors())
server.use(express.json())

port = process.env.PORT || 3002

console.log(endpointsList(server))

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    server.listen(port, () => {
      console.log("server running on port", port)
    })
  } catch (error) {
    console.log(error)
  }
}

connectDb()
