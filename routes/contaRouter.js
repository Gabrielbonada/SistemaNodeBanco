const express = require('express');
const router = express.Router();
const contaController = require('../controllers/Contacontroller');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de conta são privadas
router.use(authMiddleware);

router.get('/saldo',   contaController.getSaldo);
router.get('/extrato', contaController.getExtrato);
router.get('/dados',   contaController.getDadosConta);

module.exports = router;