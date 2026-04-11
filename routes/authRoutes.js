const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); 
const authMiddleware = require("../middlewares/authMiddleware");  // ← protege rotas privadas

// Rotas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);

// Rotas privadas (precisam de token)
router.get("/perfil", authMiddleware, authController.getPerfil);

module.exports = router;