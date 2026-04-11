const Conta = require('../models/Conta');
const Transacao = require('../models/Transacao');

const getSaldo = async (userId) => {
  const conta = await Conta.findOne({ userId, ativa: true });
  if (!conta) throw new Error('Conta não encontrada');
  return { saldo: conta.saldo, numeroConta: conta.numeroConta, agencia: conta.agencia };
};

const getExtrato = async (userId, limite = 20) => {
  const conta = await Conta.findOne({ userId, ativa: true });
  if (!conta) throw new Error('Conta não encontrada');

  const transacoes = await Transacao.find({ contaId: conta._id })
    .sort({ createdAt: -1 })
    .limit(limite);

  return { conta, transacoes };
};

const getDadosConta = async (userId) => {
  const conta = await Conta.findOne({ userId, ativa: true });
  if (!conta) throw new Error('Conta não encontrada');
  return conta;
};

// Busca conta por número (para transferências)
const getContaPorNumero = async (numeroConta) => {
  const conta = await Conta.findOne({ numeroConta, ativa: true }).populate('userId', 'nome');
  if (!conta) throw new Error('Conta de destino não encontrada');
  return conta;
};

module.exports = { getSaldo, getExtrato, getDadosConta, getContaPorNumero };