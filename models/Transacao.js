const mongoose = require('mongoose');

const transacaoSchema = new mongoose.Schema({
  contaId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Conta' },
  faturaId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Fatura' },
  tipo:      { type: String, enum: ['pix', 'transferencia', 'boleto', 'debito', 'credito'], required: true },
  valor:     { type: Number, required: true },
  descricao: { type: String },
  status:    { type: String, enum: ['pendente', 'concluida', 'cancelada'], default: 'pendente' },
}, { timestamps: true });

module.exports = mongoose.model('Transacao', transacaoSchema);