const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const endpointsList = require("express-list-endpoints")

const {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,

} = require("./errorHandlers");

const productsRoute = require("./services/products");

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/products", productsRoute);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(catchAllErrorHandler);

const server = express()
server.use(helmet())
server.use(cors())
server.use(express.json())

server.use("/products", productsRoute)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

port = process.env.PORT || 3002

console.log(endpointsList(server))

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_ATLAS, {
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
