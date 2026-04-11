const Cartao = require('../models/Cartao');
const Fatura = require('../models/Fatura');
const Transacao = require('../models/Transacao');

// ─── CARTÃO ───────────────────────────────────────────────────────────────────

const gerarNumeroCartao = () => {
  return Array.from({ length: 4 }, () =>
    Math.floor(1000 + Math.random() * 9000)
  ).join(' ');
};

const criarCartao = async (userId, { tipo, limiteTotal }) => {
  const cartaoExistente = await Cartao.findOne({ userId, status: 'ativo' });
  if (cartaoExistente) throw new Error('Usuário já possui um cartão ativo');

  const validade = new Date();
  validade.setFullYear(validade.getFullYear() + 5);

  const cartao = await Cartao.create({
    userId,
    numero: gerarNumeroCartao(),
    tipo,
    limiteTotal: tipo === 'debito' ? 0 : limiteTotal,
    limiteDisponivel: tipo === 'debito' ? 0 : limiteTotal,
    validade,
  });

  return cartao;
};

const getCartao = async (userId) => {
  const cartao = await Cartao.findOne({ userId, status: 'ativo' });
  if (!cartao) throw new Error('Nenhum cartão ativo encontrado');
  return cartao;
};

const bloquearCartao = async (userId) => {
  const cartao = await Cartao.findOneAndUpdate(
    { userId, status: 'ativo' },
    { status: 'bloqueado' },
    { new: true }
  );
  if (!cartao) throw new Error('Cartão não encontrado');
  return { mensagem: 'Cartão bloqueado com sucesso', cartao };
};

const desbloquearCartao = async (userId) => {
  const cartao = await Cartao.findOneAndUpdate(
    { userId, status: 'bloqueado' },
    { status: 'ativo' },
    { new: true }
  );
  if (!cartao) throw new Error('Cartão bloqueado não encontrado');
  return { mensagem: 'Cartão desbloqueado com sucesso', cartao };
};

// ─── FATURA ───────────────────────────────────────────────────────────────────

const getFaturaAberta = async (userId) => {
  const cartao = await Cartao.findOne({ userId, status: 'ativo' });
  if (!cartao) throw new Error('Cartão não encontrado');

  let fatura = await Fatura.findOne({ cartaoId: cartao._id, status: 'aberta' });

  // Cria fatura do mês se não existir
  if (!fatura) {
    const vencimento = new Date();
    vencimento.setDate(10); // vence dia 10 do próximo mês
    vencimento.setMonth(vencimento.getMonth() + 1);

    fatura = await Fatura.create({ cartaoId: cartao._id, vencimento });
  }

  const transacoes = await Transacao.find({ faturaId: fatura._id }).sort({ createdAt: -1 });

  return { fatura, transacoes, limiteDisponivel: cartao.limiteDisponivel };
};

const pagarFatura = async (userId, valor) => {
  const cartao = await Cartao.findOne({ userId, status: 'ativo' });
  if (!cartao) throw new Error('Cartão não encontrado');

  const fatura = await Fatura.findOne({ cartaoId: cartao._id, status: 'fechada' });
  if (!fatura) throw new Error('Nenhuma fatura fechada para pagar');
  if (valor < fatura.valorTotal) throw new Error('Valor menor que o total da fatura');

  fatura.status = 'paga';
  await fatura.save();

  // Restaura limite ao pagar fatura
  cartao.limiteDisponivel = cartao.limiteTotal;
  await cartao.save();

  return { mensagem: 'Fatura paga com sucesso', fatura };
};

const usarCredito = async (userId, { valor, descricao }) => {
  const cartao = await Cartao.findOne({ userId, status: 'ativo' });
  if (!cartao) throw new Error('Cartão não encontrado');
  if (cartao.tipo === 'debito') throw new Error('Cartão não possui crédito');
  if (cartao.limiteDisponivel < valor) throw new Error('Limite insuficiente');

  let fatura = await Fatura.findOne({ cartaoId: cartao._id, status: 'aberta' });
  if (!fatura) {
    const vencimento = new Date();
    vencimento.setDate(10);
    vencimento.setMonth(vencimento.getMonth() + 1);
    fatura = await Fatura.create({ cartaoId: cartao._id, vencimento });
  }

  fatura.valorTotal += valor;
  await fatura.save();

  cartao.limiteDisponivel -= valor;
  await cartao.save();

  await Transacao.create({
    faturaId: fatura._id,
    tipo: 'credito',
    valor: -valor,
    descricao: descricao || 'Compra no crédito',
    status: 'concluida',
  });

  return { mensagem: 'Compra realizada', limiteDisponivel: cartao.limiteDisponivel };
};

module.exports = { criarCartao, getCartao, bloquearCartao, desbloquearCartao, getFaturaAberta, pagarFatura, usarCredito };