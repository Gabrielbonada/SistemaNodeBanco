const Tarefa = require("../models/tarefa"); 


const criarTarefa = async (req, res) => { 
    try {
        const tarefa = await Tarefa.create(req.body); 
        res.status(201).json(tarefa); 
    } catch (erro) {
        res.status(400).json({ erro: erro.message }); 
    }
};

module.exports = { criarTarefa };