const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const validaToken = (req, res, next) => {
	//Leer token del header
	const token = req.header("x-auth-token");

	if (!token) {
		return res.status(401).json({msg: "Falta el token en el header"});
	}

	//Valido que el token sea valido
	try {
		const payload = jwt.verify(token, secret);
		req.usuario = payload.usuario;
		next();
	} catch (error) {
		res.status(401).json({msg: "Token no valido"});
	}
};

module.exports = validaToken;
