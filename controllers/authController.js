const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTRO
exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUser = new User({
      nome,
      email,
      senha: senhaHash
    });

    await novoUser.save();

    res.status(201).json({ msg: "Usuário criado com sucesso" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ msg: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};