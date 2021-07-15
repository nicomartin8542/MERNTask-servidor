const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

//Iniciar sesion
exports.autenticarUsuario = async (req, res) => {
	//revisa si hay errores
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({error: errors});
	}

	const {email, password} = req.body;

	try {
		//Valido que el usuario exista
		let usuario = await Usuario.findOne({email});
		if (!usuario) {
			return res.status(404).json({msg: "El usuario no existe"});
		}

		//Valido que la constraseña coincidan
		let passwordCorrect = await bcryptjs.compare(password, usuario.password);
		if (!passwordCorrect) {
			return res.status(400).json({
				msg: "El usuario o contraseña son incorrectos. Vuelva a intentar",
			});
		}

		//Si todo esta correcto devuelvo el token
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
		res.status(500).json({error: error.message});
	}
};

//Obtener usuario autenticado
exports.obtenerUsuario = async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.usuario).select("-password");
		res.json({usuario});
	} catch (error) {
		res.status(500).json({msg: "Error en el servidor"});
	}
};
