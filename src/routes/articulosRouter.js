const express = require("express");
const router = express.Router();
const articulosController = require("../controllers/articulosController")

router.get("/", articulosController.getArticulos);
router.get("/:id", articulosController.getArticulosById);
router.post("/", articulosController.addArticulo); 
router.put("/:id", articulosController.updateArticulo);
router.delete("/:id", articulosController.deleteArticulo);

module.exports = router;