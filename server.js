const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("")
.then (() => console.log("conectado ao banco"))
.catch(erro => console.error(erro)) 

const app = express();