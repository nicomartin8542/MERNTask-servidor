const express = require("express");
const app = express.Router();
const {check} = require("express-validator");
const tareaController = require("../controllers/tareaController");
const validaToken = require("../middlewares/auth");
const {crearTarea, obtenerTareas, eliminarTarea, actualizarTarea} =
	tareaController;

//Crea tarea
//api/tarea

//Creo tarea
app.post(
	"/",
	validaToken,
	[
		check("nombre", "El nombre de la tarea es obligatorio").notEmpty(),
		check("proyecto", "El id del proyecto es obligatorio").notEmpty(),
	],
	crearTarea,
);

//Obteniendo tareas de un proyecto
app.get(
	"/",
	validaToken,
	[check("proyecto", "El id del proyecto es obligatorio").notEmpty()],
	obtenerTareas,
);

//Eliminando tarea de un proyecto
app.delete("/:id", validaToken, eliminarTarea);

//Actualizando tarea de un proyecto
app.put("/:id", validaToken, actualizarTarea);

module.exports = app;
