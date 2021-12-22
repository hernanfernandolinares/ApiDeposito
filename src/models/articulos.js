const mongoose = require("mongoose");

const articulosSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  img: {
    type: String,
  },
  codigo: {
    type: String,
  },
  familia: {
    type: String,
    required: true,
    enum: ["lubricantes", "aserrinera","automotor","mantenimiento","electrico","instrumento","bombas"],
  },
});

module.exports = mongoose.model("Articulos", articulosSchema);