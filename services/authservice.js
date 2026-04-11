const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Conta = require('../models/Conta');

// Gera número de conta aleatório
const gerarNumeroConta = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async ({ nome, email, senha, cpf, telefone }) => {
  const usuarioExistente = await User.findOne({ $or: [{ email }, { cpf }] });
  if (usuarioExistente) {
    throw new Error('E-mail ou CPF já cadastrado');
  }

  const user = await User.create({ nome, email, senha, cpf, telefone });

  
  await Conta.create({
    userId: user._id,
    numeroConta: gerarNumeroConta(),
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { user: { id: user._id, nome: user.nome, email: user.email }, token };
};

const login = async ({ email, senha }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuário não encontrado');

  const senhaCorreta = await bcrypt.compare(senha, user.senha);
  if (!senhaCorreta) throw new Error('Senha incorreta');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { user: { id: user._id, nome: user.nome, email: user.email }, token };
};

const getPerfil = async (userId) => {
  const user = await User.findById(userId).select('-senha');
  if (!user) throw new Error('Usuário não encontrado');
  return user;
};

module.exports = { register, login, getPerfil };