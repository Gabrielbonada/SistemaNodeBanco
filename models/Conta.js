const mongoose = require('mongoose');

const contaSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  saldo:        { type: Number, default: 0 },
  numeroConta:  { type: String, required: true, unique: true },
  agencia:      { type: String, default: '0001' },
  tipo:         { type: String, enum: ['corrente', 'poupanca'], default: 'corrente' },
  ativa:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Conta', contaSchema);