const express = require("express")
const router = require("router")
const {criarTarefa} = require("../controllers/TarefasController")

router.post("/", criarTarefa);


module.exports = router;