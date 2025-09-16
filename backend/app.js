const express = require("express");
const app = express();
const PORT = 4000;
const loginRoutes = require('./routes/loginRoutes');

app.use(express.json());
app.use("/", loginRoutes)

app.get("/", (req, res) => {
    res.send("Servidor Express funcionando correctamente");
});

module.exports = app;