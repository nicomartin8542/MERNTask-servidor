const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

//Controller para crear un usuario
exports.crearUsuario = async (req, res) => {
	//revisa si hay errores
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({error: errors});
	}

	//Extraigo email y password del body
	const {password, email} = req.body;

	try {
		//Valido que el usuario no exista
		let usuario = await Usuario.findOne({email});
		if (usuario) {
			res.status(400).json({
				status: "Error",
				msg: "El usuario ya exite",
			});
		}

		//Agrego usuario nuevo
		usuario = new Usuario(req.body);

		const salt = await bcryptjs.genSalt(10);
		usuario.password = await bcryptjs.hash(password, salt);

		await usuario.save();

		//Crear y firmar el jwt
		const payload = {
			usuario: usuario.id,
		};

		jwt.sign(
			payload,
			secret,
			{
				expiresIn: 3600,
			},
			(error, token) => {
				if (error) throw error;
				res.json({token});
			},
		);
	} catch (error) {
		res.status(400).json({
			status: "Error",
			msg: error.message,
		});
	}
};
