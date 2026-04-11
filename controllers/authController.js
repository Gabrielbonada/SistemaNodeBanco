const authService = require('../services/authservice');

const register = async (req, res) => {
  try {
    const resultado = await authService.register(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const login = async (req, res) => {
  try {
    const resultado = await authService.login(req.body);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(401).json({ erro: err.message });
  }
};

const getPerfil = async (req, res) => {
  try {
    const user = await authService.getPerfil(req.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

module.exports = { register, login, getPerfil };