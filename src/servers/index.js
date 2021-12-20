const express = require("express");
const characters = require("../data/articulos.json");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

let databaseObject = {};
let characterCollectionObj = {};

const dbConnection = async () => {
  const uri =
    "";

  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    // Conectar el back con el cluster de MongoDB
    await client.connect();
    databaseObject = await client.db("ejemploDb");
    characterCollectionObj = databaseObject.collection("aritulos");    

    console.log("Cloud DB Connected - Mongo DB");
  } catch (error) {
    console.log(error);
  }
};

dbConnection().catch(console.error);

const mappedCharacters = characters.map((item) => {
  return {
    ...item,
    img: `http://localhost:${PORT}/${item.img}`,
  };
});

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//---- Recurso PERSONAJE ----//

// metodo get de personajes //
app.get("/personajes", async (req, res) => {
  try {
    const allPersonajes = await characterCollectionObj.find({}).toArray();
    res.status(200).send(allArticulos);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/Articulos", async (req, res) => {
  try {
    const allArticulos = await charterCollectionObj.find({}).toArray();
    res.status(200).send(allArticulos);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// metodo get por id //
app.get("/articulos/:id", async (req, res) => {
  try {
    const personaje = await characterCollectionObj.findOne({
      id: req.params.id,
    });

    if (!articulo) {
      return res.status(404).send({
        message: `No se encontro el articulo con ID ${req.params.id}`,
      });
    }
    res.status(200).send(articulo);
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});

// metodo get personajes por casa //
app.get("/articulo/familia/:familia", async (req, res) => {
  try {
    const articulo = await characterCollectionObj
      .find({
        familia: req.params.familia,
      })
      .toArray();

    if (!articulo.length) {
      return res.status(404).send({
        message: `No se encontro articulo con familia ${req.params.casa}`,
      });
    }
    res.status(200).send(articulo);
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});

// metodo post para articulos //
app.post("/articulos", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: "No pudo añadirse el articulo porque no existe body",
      });
    }

    const newPersonaje = { ...req.body };

    await characterCollectionObj.insertOne(newArticulo);
    res.status(200).send({
      message: "El articulo fue añadido exitosamente",
    });
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

// metodo update para articulos ""
app.put("/articulo/:id", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: "No pudo actualizarse el articulo porque no existe body",
      });
    }

    const articulo = await characterCollectionObj.findOne({
      id: req.params.id,
    });

    if (!personaje) {
      return res.status(404).send({
        message: "No se encontro el personaje",
      });
    }

    const newValue = {
      $set: {
        nombre: req.body.nombre,
        bio: req.body.bio,
        img: req.body.img,     
        unidad: req.body.unidad,     
        familia: req.body.familia,
      },
    };

    const updateOne = await characterCollectionObj.updateOne(
      { id: req.params.id },
      newValue
    );

    res.status(200).send({
      message: "Se actualizo exitosamente",
      personaje: updateOne,
    });
  } catch (error) {}
  // const doesItExist = mappedCharacters.some(
  //   (character) => character.id === req.params.id
  // );

  // if (!doesItExist) {
  //   res
  //     .status(404)
  //     .send(
  //       `No pudo actualizarse el personaje porque no existe personaje con ID ${req.params.id}`
  //     );
  // } else if (Object.keys(req.body).length === 0) {
  //   res
  //     .status(400)
  //     .send(`No pudo actualizarse el personajee porque no existe body`);
  // } else {
  //   const character = mappedCharacters.map((character) => {
  //     return character.id === req.params.id ? req.body : character;
  //   });
  //   res.status(200).send(character);
  // }
});

// metodo delete para personajes //

app.delete("/personajes/:id", async (req, res) => {
  try {
    const characterDeleteData = await characterCollectionObj.deleteOne({
      id: req.params.id,
    });

    if (!characterDeleteData.deletedCount) {
      return res.status(404).send({
        message: `No se pudo eliminar el personaje con ID ${req.params.id}`,
      });
    }

    const responseMovie = await moviesCollectionObj.deleteMany({
      idPersonaje: req.params.id,
    });

    res
      .status(200)
      .send(
        `El personaje con ID ${req.params.id} fue eliminado exitosamente ${
          responseMovie.deletedCount
            ? "y tambien se eliminaron las peliculas asociadas"
            : ""
        }`
      );
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});