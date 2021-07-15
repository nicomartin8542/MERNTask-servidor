//Rutas para crear usuarios
const express = require("express");
const app = express.Router();
const usuarioController = require("../controllers/usuarioController");
const {crearUsuario} = usuarioController;
const {check} = require("express-validator");

//Crea usuario
//api/usuarios
app.post(
	"/",
	[
		check("nombre", "El nombre es obligatorio").notEmpty(),
		check("email", "Agrega un mail valido").isEmail(),
		check("password", "El password debe ser minimo 6 caracteres").isLength({
			min: 6,
		}),
	],
	crearUsuario,
);

module.exports = app;
