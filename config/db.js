const mongoose = require("mongoose");
//Variable de entorno.
require("dotenv").config({path: "variables.env"});

const contectarDB = async () => {
	try {
		await mongoose.connect(process.env.DB_MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
		console.log("BD conectada");
	} catch (error) {
		console.log(error);
		process.exit(1); //Detener la app
	}
};

module.exports = contectarDB;
