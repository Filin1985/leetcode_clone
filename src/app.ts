import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.js";

import db from "./models/index.js";
const { sequelize } = db;

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Sync database and start server
const PORT = process.env.PORT || 3000;
sequelize
  .sync({force: process.env.NODE_ENV === "test"})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error("Database sync error:", err);
  });

export default app;
