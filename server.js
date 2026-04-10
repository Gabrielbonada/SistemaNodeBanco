require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// conectar banco
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// 🔥 SERVIR FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// 🔥 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// rotas da API
app.use("/api/auth", require("./routes/authRoutes"));

// subir servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🔥");
});