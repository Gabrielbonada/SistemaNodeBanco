const cartaoService = require('../services/cartaoService');

const criarCartao = async (req, res) => {
  try {
    const cartao = await cartaoService.criarCartao(req.userId, req.body);
    res.status(201).json(cartao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const getCartao = async (req, res) => {
  try {
    const cartao = await cartaoService.getCartao(req.userId);
    res.status(200).json(cartao);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

const bloquearCartao = async (req, res) => {
  try {
    const resultado = await cartaoService.bloquearCartao(req.userId);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const desbloquearCartao = async (req, res) => {
  try {
    const resultado = await cartaoService.desbloquearCartao(req.userId);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const getFaturaAberta = async (req, res) => {
  try {
    const fatura = await cartaoService.getFaturaAberta(req.userId);
    res.status(200).json(fatura);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

const pagarFatura = async (req, res) => {
  try {
    const { valor } = req.body;
    const resultado = await cartaoService.pagarFatura(req.userId, valor);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const usarCredito = async (req, res) => {
  try {
    const resultado = await cartaoService.usarCredito(req.userId, req.body);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

module.exports = { criarCartao, getCartao, bloquearCartao, desbloquearCartao, getFaturaAberta, pagarFatura, usarCredito };