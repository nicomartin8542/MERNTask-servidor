const express = require("express");
const app = express.Router();
const {check} = require("express-validator");
const proyectoController = require("../controllers/proyectoController");
const validaToken = require("../middlewares/auth");
const {crearProyecto, obtenerProyectos, actualizaProyecto, eliminarProyecto} =
	proyectoController;

//Crea poryectos
//api/proyecto
app.post(
	"/",
	validaToken,
	[check("nombre", "El nombre del proyecto es obligatorio").notEmpty()],
	crearProyecto,
);

//Obtener proyectos
app.get("/", validaToken, obtenerProyectos);

//Actualizar proyectos
app.put(
	"/:id",
	validaToken,
	[check("nombre", "El nombre del proyecto es obligatorio").notEmpty()],
	actualizaProyecto,
);

//Eliminar un proyecto
app.delete("/:id", validaToken, eliminarProyecto);

module.exports = app;
