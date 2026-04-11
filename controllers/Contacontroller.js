const contaService = require('../services/contaService');

const getSaldo = async (req, res) => {
  try {
    const dados = await contaService.getSaldo(req.userId);
    res.status(200).json(dados);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

const getExtrato = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 20;
    const dados = await contaService.getExtrato(req.userId, limite);
    res.status(200).json(dados);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

const getDadosConta = async (req, res) => {
  try {
    const conta = await contaService.getDadosConta(req.userId);
    res.status(200).json(conta);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

module.exports = { getSaldo, getExtrato, getDadosConta };