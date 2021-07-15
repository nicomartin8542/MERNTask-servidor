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
const port = process.env.port || 4000;

//Importar Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyecto", require("./routes/proyecto"));
app.use("/api/tarea", require("./routes/tarea"));

//Arrancar el servidor
app.listen(port, () => {
	console.log(`El servidor esta funcionando en el  ${port}`);
});
