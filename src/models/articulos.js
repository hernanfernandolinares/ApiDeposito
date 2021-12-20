const mongoose = require("mongoose");

const articulosSchema = mongoose.Schema({
  idArticulo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulos",
    required: true,
  },
  nombreArticulo: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
});

module.exports = mongoose.model("Peliculas", peliculasSchema);