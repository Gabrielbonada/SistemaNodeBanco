const mongoose = require ("mongoose");


const TarefaSchema = new mongoose.Schema({

    titulo : {type : String , required : true },
    descricao : {type : String },
    datadecriacao : { type : Date , default : Date.now},
    concluida : { type : Boolean, default: false}

})

module.exports = mongoose.model("tarefa", TarefaSchema);