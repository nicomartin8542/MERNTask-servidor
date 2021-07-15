//Rutas para autenticar usuarios
const express = require("express");
const app = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const {check} = require("express-validator");
const {autenticarUsuario, obtenerUsuario} = authController;

//Iniciar sesion
//api/auth
app.post("/", autenticarUsuario);

//Obtener usuario autenticado
app.get("/", auth, obtenerUsuario);

module.exports = app;
