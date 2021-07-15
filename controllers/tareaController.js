var mongoose = require("mongoose");
const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const {validationResult} = require("express-validator");

//POST: Creo tarea
exports.crearTarea = async (req, res) => {
	//Revisa si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({error: errores.array()});
	}

	//Extraigo variables del body
	const {proyecto} = req.body;

	//Reviso si el id enviado es valido (ObjetId)
	if (!mongoose.Types.ObjectId.isValid(proyecto)) {
		return res.status(400).json({
			msg: "Tipo de ID de la tarea incorrecto, verificar que sea un ObjetId valido con mongoose",
		});
	}

	try {
		//Valido que le proyecto exista
		let proyectoExistente = await Proyecto.findById(proyecto);

		if (!proyectoExistente) {
			return res.status(404).json({msg: "El proyecto no existe"});
		}

		//Valido que el usuario sea el dueño del proyecto
		if (proyectoExistente.creador.toString() !== req.usuario) {
			return res.status(400).json({msg: "No autorizado"});
		}

		//Creo Tarea
		const tarea = new Tarea(req.body);
		await tarea.save();
		res.json({tarea});
	} catch (error) {
		res.status(500).json({error: error.message, msg: "Error en el servidor"});
	}
};

//GET Obtengo tareas
exports.obtenerTareas = async (req, res) => {
	//Valido que el body sea correcto
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({errores});
	}

	//Extraigo proyecto del body
	const {proyecto} = req.query;

	//Valido que el id del producto sea valido
	if (!mongoose.isValidObjectId(proyecto)) {
		return res.status(400).json({
			msg: "El formato del id del proyecto no es valido para mongoose.",
		});
	}

	try {
		//Valido que el proyecto exista
		const proyectoExistente = await Proyecto.findById(proyecto);
		if (!proyectoExistente) {
			return res.status(404).json({msg: "Proyecto inexistente"});
		}

		//Valido que el usuario sea el dueño del proyecto
		if (proyectoExistente.creador.toString() !== req.usuario) {
			return res.status(400).json({msg: "No autorizado"});
		}

		//Obtengo tareas del proyecto
		const tareas = await Tarea.find({proyecto: proyectoExistente._id}).sort({
			creado: -1,
		});
		res.json({tareas});
	} catch (error) {
		res.status(500).json({error: error.message, msg: "Error en el servidor"});
	}
};

//Elimino Tarea
exports.eliminarTarea = async (req, res) => {
	const tareaId = req.params.id;

	//Valido que el id del proyecto sea valido
	if (!mongoose.isValidObjectId(tareaId)) {
		return res.status(400).json({
			msg: "El formato del id del proyecto no es valido para mongoose.",
		});
	}

	try {
		//Valido que el proyecto exista
		const tareaExistente = await Tarea.findById(tareaId);
		if (!tareaExistente) {
			return res.status(404).json({msg: "Tarea inexistente"});
		}

		//Verifico que el usuario que elimina sea el dueño del proyecto
		const proyecto = await Proyecto.findById(tareaExistente.proyecto);
		if (proyecto.creador.toString() !== req.usuario) {
			return res.status(400).json({msg: "No autorizado"});
		}

		//Elimino Tarea
		const tarea = await Tarea.findByIdAndRemove(tareaId);
		res.json({msg: "Tarea Eliminada", tarea});
	} catch (error) {
		res.status(500).json({error: error.message, msg: "Error en servidor"});
	}
};

//Actualizo Tareas
exports.actualizarTarea = async (req, res) => {
	//Valido que le nombre en el body no venga vacio
	const error = validationResult(req);
	if (!error.isEmpty()) {
		res.status(400).json({error: error.array()});
	}

	//Variables
	const tareaId = req.params.id;
	const {nombre, estado} = req.body;
	const tareaNueva = {};

	//Adecuo codigo por si vienen mas campos.
	if (nombre) tareaNueva.nombre = nombre;
	if (estado === true || estado === false) tareaNueva.estado = estado;

	//Valido que el id enviado sea valido con mongoose
	if (!mongoose.isValidObjectId(tareaId)) {
		return res.status(400).json({
			msg: "El formato del id del proyecto no es valido para mongoose.",
		});
	}

	try {
		//Valido que la tarea exista
		const tareaExiste = await Tarea.findById(tareaId);
		if (!tareaExiste) {
			return res.status(404).json({msg: "Tarea inexistente"});
		}

		//Valido que el usuario sea el dueño del proyect
		const proyecto = await Proyecto.findById(tareaExiste.proyecto);
		if (proyecto.creador.toString() !== req.usuario) {
			return res.status(400).json({msg: "No autorizado"});
		}

		//Actualizo Tareas
		const tarea = await Tarea.findOneAndUpdate({_id: tareaId}, tareaNueva, {
			new: true,
		});

		res.json({tarea});
	} catch (error) {
		res.status(500).json({error: error.message, msg: "Error en el servidor"});
	}
};
