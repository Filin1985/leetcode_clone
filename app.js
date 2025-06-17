const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const routes = require("./routes")
require('dotenv').config();
const {errorHandler} = require("./middlewares/error")
const {sequelize} = require("./models")

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml")
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Routes
app.use("/api", routes)

// Error handling
app.use(errorHandler)

// Sync database and start server
const PORT = process.env.PORT || 3000
sequelize
  .sync({force: process.env.NODE_ENV === "test"})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Database sync error:", err)
  })

module.exports = app
