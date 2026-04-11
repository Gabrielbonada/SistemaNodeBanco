const transacaoService = require('../services/transacaoService');

const enviarPix = async (req, res) => {
  try {
    const resultado = await transacaoService.enviarPix(req.userId, req.body);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const fazerTransferencia = async (req, res) => {
  try {
    const resultado = await transacaoService.transferir(req.userId, req.body);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const pagarBoleto = async (req, res) => {
  try {
    const resultado = await transacaoService.pagarBoleto(req.userId, req.body);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

module.exports = { enviarPix, fazerTransferencia, pagarBoleto };