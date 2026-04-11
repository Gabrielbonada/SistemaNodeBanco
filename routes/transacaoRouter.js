const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/Transacaocontroller');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de transação são privadas
router.use(authMiddleware);

router.post('/pix',          transacaoController.enviarPix);
router.post('/transferencia', transacaoController.fazerTransferencia);
router.post('/boleto',        transacaoController.pagarBoleto);

module.exports = router;