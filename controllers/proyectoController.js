var mongoose = require("mongoose");
const Proyecto = require("../models/Proyecto");
const {validationResult} = require("express-validator");

//Controller para crear un usuario
exports.crearProyecto = async (req, res) => {
	//Revisa si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({error: errores.array()});
	}

	try {
		const proyecto = new Proyecto(req.body);
		proyecto.creador = req.usuario;
		proyecto.save();
		res.json({proyecto});
	} catch (error) {
		res.satus(500).json({error: error.message});
	}
};

//Obtiene todos los poryectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
	try {
		const proyectos = await Proyecto.find({creador: req.usuario}).sort({
			creado: -1,
		});
		res.json({proyectos});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

//Actualizo proyecto
exports.actualizaProyecto = async (req, res) => {
	//Reviso si el id enviado es valido (ObjetId)
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({
			msg: "Tipo de ID del proyecto incorrecto, verificar que sea un ObjetId valido con mongoose",
		});
	}

	//Revisa si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({error: errores.array()});
	}

	const {nombre} = req.body;
	const proyectoNuevo = {};

	if (nombre) {
		proyectoNuevo.nombre = nombre;
	}

	try {
		//Revisa ID
		let proyecto = await Proyecto.findById(req.params.id);

		//Revisa si el proyecto existe
		if (!proyecto) {
			return res.status(404).json({msg: "El proyecto no existe"});
		}

		//verifica que el id enviado sea el que creo el proyecto
		if (proyecto.creador.toString() !== req.usuario) {
			return res.status(400).json({msg: "No autorizado"});
		}

		//Actualizar
		proyecto = await Proyecto.findByIdAndUpdate(
			{_id: req.params.id},
			{$set: proyectoNuevo},
			{new: true},
		);

		res.json({proyecto});
	} catch (error) {
		res.status(500).json({error: error.message, msg: "Error en el servidor"});
	}
};

//Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
	//Reviso si el id enviado es valido (ObjetId)
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({
			msg: "Tipo de ID del proyecto incorrecto, verificar que sea un ObjetId valido con mongoose",
		});
	}

	try {
		//Revisar el ID
		let proyecto = await Proyecto.findById(req.params.id);

		if (!proyecto) {
			return res.status(400).json({msg: "El proyecto a eliminar no exite"});
		}

		//Valido que el usuario que quiera eliminar sea el creador del proyecto
		if (proyecto.creador.toString() !== req.usuario) {
			return res.status(400).json({msg: "No autorizado"});
		}

		//Elimino el proyevto
		proyecto = await Proyecto.findOneAndRemove({_id: req.params.id});

		res.json({proyecto});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};
