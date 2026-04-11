const express = require('express');
const router = express.Router();
const cartaoController = require('../controllers/Cartaocontroller');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de cartão são privadas
router.use(authMiddleware);

router.post('/',             cartaoController.criarCartao);
router.get('/',              cartaoController.getCartao);
router.patch('/bloquear',    cartaoController.bloquearCartao);
router.patch('/desbloquear', cartaoController.desbloquearCartao);
router.get('/fatura',        cartaoController.getFaturaAberta);
router.post('/fatura/pagar', cartaoController.pagarFatura);
router.post('/credito',      cartaoController.usarCredito);

module.exports = router;