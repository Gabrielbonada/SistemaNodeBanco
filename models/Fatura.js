const mongoose = require('mongoose');

const faturaSchema = new mongoose.Schema({
  cartaoId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Cartao', required: true },
  valorTotal:  { type: Number, default: 0 },
  vencimento:  { type: Date, required: true },
  status:      { type: String, enum: ['aberta', 'fechada', 'paga'], default: 'aberta' },
}, { timestamps: true });

module.exports = mongoose.model('Fatura', faturaSchema);