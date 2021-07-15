const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//Crear Servidor
const app = express();

//Contenctar a la basde de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Habilito para que se puedan procesar respuestas en JSON
app.use(express.json({extends: true}));

//Puerto de la app
const PORT = process.env.PORT || 4000;

//ImPORTar Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyecto", require("./routes/proyecto"));
app.use("/api/tarea", require("./routes/tarea"));

//Arrancar el servidor
app.listen(PORT, "0.0.0.0", () => {
	console.log(`El servidor esta funcionando en el  ${PORT}`);
});
