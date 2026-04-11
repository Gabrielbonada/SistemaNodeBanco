const mongoose = require('mongoose');

const cartaoSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numero:            { type: String, required: true, unique: true },
  tipo:              { type: String, enum: ['debito', 'credito', 'ambos'], required: true },
  limiteTotal:       { type: Number, default: 0 },
  limiteDisponivel:  { type: Number, default: 0 },
  status:            { type: String, enum: ['ativo', 'bloqueado', 'cancelado'], default: 'ativo' },
  validade:          { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cartao', cartaoSchema);