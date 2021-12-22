const express = require("express");
const articulosRouter = require("./articulosRouter");

const router = express.Router();

router.use("/articulos", articulosRouter);


module.exports = router;