const express = require("express");
const app = express();
const PORT = 4000;
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use("/", authRoutes)

app.get("/", (req, res) => {
    res.send("Servidor Express funcionando correctamente");
});

module.exports = app;