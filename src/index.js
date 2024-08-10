const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const categorieRoutes = require("./routes/categorie");
// const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors()); 
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", categorieRoutes);
// app.use("/auth", authRoutes);

// Rutas
app.get("/", (req, res) => {
  res.send("¡Bienvenidos!");
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

app.listen(port, () => console.log("Server listening on port", port));
