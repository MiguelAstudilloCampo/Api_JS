const express = require("express");
const userSchema = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Autenticación de usuario
router.post("/login", async (req, res) => {
  // Desestructuración para obtener los datos del JSON de la petición
  const { correo, contraseña } = req.body;

  // Validar que ambos campos estén presentes
  if (!correo || !contraseña) {
    return res.status(400).json({ message: "El correo y la contraseña son obligatorios." });
  }

  try {
    // Usar el modelo con la función findOne para encontrar el usuario por email
    const user = await userSchema.findOne({ correo });

    // Validar si el usuario de la consulta existe o no
    if (!user) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos." });
    }

    // Comparar la contraseña proporcionada con la almacenada en la BD
    const comparePassword = await bcrypt.compare(contraseña, user.contraseña);

    // Validar si la contraseña es correcta o no
    if (!comparePassword) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos." });
    }

    // Utilizamos la función JWT para generar un token con los datos de nuestro usuario
    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });

    // Con la función response (res) estamos retornando el token y un JSON con un mensaje
    return res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }
});

// Verificación de Token
router.post("/verifyToken", async (req, res) => {
  const { token } = req.body;

  // Validar que el token esté presente
  if (!token) {
    return res.status(400).json({ message: "Token no proporcionado." });
  }

  jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido." });
    } else {
      return res.status(200).json({ decoded });
    }
  });
});

module.exports = router;
