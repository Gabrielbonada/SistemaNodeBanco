const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nome:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  senha:    { type: String, required: true },
  cpf:      { type: String, required: true, unique: true },
  telefone: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);