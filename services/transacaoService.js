const mongoose = require('mongoose');
const Conta = require('../models/Conta');
const Transacao = require('../models/Transacao');

// ─── PIX / TRANSFERÊNCIA ──────────────────────────────────────────────────────

const transferir = async (userId, { numeroDestino, valor, descricao, tipo = 'transferencia' }) => {
  if (valor <= 0) throw new Error('Valor inválido');

  // Usa session para garantir que as duas operações acontecem juntas (atomicidade)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const contaOrigem = await Conta.findOne({ userId, ativa: true }).session(session);
    if (!contaOrigem) throw new Error('Conta de origem não encontrada');
    if (contaOrigem.saldo < valor) throw new Error('Saldo insuficiente');

    const contaDestino = await Conta.findOne({ numeroConta: numeroDestino, ativa: true }).session(session);
    if (!contaDestino) throw new Error('Conta de destino não encontrada');
    if (contaOrigem._id.equals(contaDestino._id)) throw new Error('Não é possível transferir para a mesma conta');

    // Debita origem
    contaOrigem.saldo -= valor;
    await contaOrigem.save({ session });

    // Credita destino
    contaDestino.saldo += valor;
    await contaDestino.save({ session });

    // Registra transação na origem (saída)
    await Transacao.create([{
      contaId: contaOrigem._id,
      tipo,
      valor: -valor,
      descricao: descricao || `${tipo === 'pix' ? 'Pix' : 'Transferência'} enviado`,
      status: 'concluida',
    }], { session });

    // Registra transação no destino (entrada)
    await Transacao.create([{
      contaId: contaDestino._id,
      tipo,
      valor: +valor,
      descricao: descricao || `${tipo === 'pix' ? 'Pix' : 'Transferência'} recebido`,
      status: 'concluida',
    }], { session });

    await session.commitTransaction();
    return { mensagem: 'Transferência realizada com sucesso', valor, destino: numeroDestino };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const enviarPix = async (userId, dados) => {
  return transferir(userId, { ...dados, tipo: 'pix' });
};

// ─── BOLETO ───────────────────────────────────────────────────────────────────

const pagarBoleto = async (userId, { codigoBarras, valor, descricao }) => {
  if (!codigoBarras) throw new Error('Código de barras inválido');
  if (valor <= 0) throw new Error('Valor inválido');

  const conta = await Conta.findOne({ userId, ativa: true });
  if (!conta) throw new Error('Conta não encontrada');
  if (conta.saldo < valor) throw new Error('Saldo insuficiente');

  conta.saldo -= valor;
  await conta.save();

  const transacao = await Transacao.create({
    contaId: conta._id,
    tipo: 'boleto',
    valor: -valor,
    descricao: descricao || 'Pagamento de boleto',
    status: 'concluida',
  });

  return { mensagem: 'Boleto pago com sucesso', transacao };
};

module.exports = { transferir, enviarPix, pagarBoleto };