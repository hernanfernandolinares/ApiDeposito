const models = require("../models");
//const mongoose = require("mongoose");
const articulos = require("../models/articulos");

const objectIdValidator = mongoose.Types.ObjectId;

const getPeliculas = async (req, res) => {
  try {
    const response = await models.Articulos.find();

    return res.status(200).json({
      data: response,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const getArticulosById = async (req, res) => {
  try {
    const peliculaId = req.params.id;
    const isValid = objectIdValidator.isValid(peliculaId);

    if (!isValid) {
      return res.status(200).json({
        msg: "El ID ingresado no correspone a un ID generado por MongoDB",
        error: true,
      });
    }
    const response = await models.Articulos.findById(articuloId);

    if (response) {
      return res.status(200).json({
        data: response,
        error: false,
      });
    } else {
      return res.status(404).json({
        msg: `el articulo con id ${articuloId} no existe`,
        error: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const addArticulo = async (req, res) => {
  try {
    const nombreArticulo = req.body.nombreArticulo;

    // validacion idArticulo

    if (!idArticulo) {
      return res.status(400).json({
        error: true,
        msg: "El campo del ID del articulo es requerido. Por favor, ingrese el id",
      });
    }

    if (!nombreArticulo) {
      return res.status(400).json({
        error: true,
        msg: "El campo nombre de articulo es requerido. Por favor, ingrese el nombre del articulo",
      });
    }

    const pelicula = new models.Articulos(req.body);
    await articulo.save();
    res.status(200).json({
      data: articulo,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const updateArticulo = async (req, res) => {
  try {
    const articuloId = req.params.id;

    const articulo = await models.Articulos.findByIdAndUpdate(
      articuloId,
      req.body,
      { new: true }
    );

    if (articulo) {
      res.status(200).json({
        error: false,
        data: articulo,
      });
    } else {
      res.status(404).json({
        error: true,
        msg: "el articulo no existe",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const deleteArticulo = async (req, res) => {
  try {
    const articuloId = req.params.id;

    const response = await models.Articulos.findByIdAndRemove(articuloId);

    if (response) {
      res.status(200).json({
        error: false,
        data: response,
        msg: `el articulo fue eliminado exitosamente`,
      });
    } else {
      res.status(400).json({
        error: true,
        msg: "el articulo no existe",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

module.exports = {
  getArticulos,
  getArticulosById,
  addArticulo,
  updateArticulo,
  deleteArticulo,
};