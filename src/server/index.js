const express = require('express');
const articulos = require('../data/articulos.json');
const bodyParser = require('body-parser');
const { MongoClient} = require('mongodb');


const app = express();
const PORT = 3000;

let databaseObject = {};
let articulosCollectionObj = {};
const dbConnetion = async () =>{
    const uri = "mongodb+srv://userDeposito:deposito@cluster0.lmdnk.mongodb.net/deposito?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useUnifiedTopology: true});
    try{
        //conecta el back con el cluster de Mongo DB
         await client.connect();
         databaseObject = await client.db("deposito");
         articulosCollectionObj = databaseObject.collection("articulos");
         console.log("colud BD conneted - Mongo DB")
    }catch(error){
        console.log(error);
    }
}


dbConnetion().catch(console.error);

const mappedArticulos = articulos.map((item) => {
    return {
        ...item,
        img: `htpp://localhost:${PORT}/${item.img}`
    }
});


app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// metodo get todos los articulos
app.get('/articulos', async (req, res) => {
    try {
        const allArticulos = await articulosCollectionObj.find({}).toArray();
        res.status(200).send(allArticulos);
    } catch (error) {
        console.log(error);
    }
    
});

//metodo get de articulos por id
app.get("/articulos/:id", async (req, res) => {
    try {
        const articulo = await articulosCollectionObj.findOne({
            id: req.params.id,
        });
        if(!articulo){
            return res.status(404).send({
                message: `no se encontro el articulo con id ${req.params.id}`,
            })
        }
        res.status(200).send(articulo);

    } catch (error) {
        return res.status(500).send({
            message: `Ocurrio un error durante la solicitud`,
            error: error,
        })
    }
    // const articulo = mappedArticulos.find((item) => item.id === req.params.id);
    // if (!articulo) return res.status(404).send('No se encontro el articulo');
    // res.status(200).send(articulo);
});

//metodo get por familia
app.get('/articulos/familia/:familia', async (req, res) => {
    try {
        const articulo = await articulosCollectionObj.find({
            familia: req.params.familia,
        })
        .toArray();
        if(!articulo.length){
            return res.status(404).send({
                message: `no se encontro el articulo con id ${req.params.familia}`,
            })
        }
        res.status(200).send(articulo);

    } catch (error) {
        return res.status(500).send({
            message: `Ocurrio un error durante la solicitud`,
            error: error,
        })
    }


    // const articulosFamilia = mappedArticulos.filter((item) => item.familia === req.params.familia);
    // if (!articulosFamilia) return res.status(404).send('No se encontro el articulo');
    // res.status(200).send(articulosFamilia);
});
app.listen(PORT, () => {
 console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//metodo post para articulos
app.post('/articulos', async (req, res) => {
    try {
        if(Object.keys(req.body).length === 0){
            return res.status(400).send({
                message: "no pudo añadirse el personaje porque no existe body"
            })
        }
        const newArticulo = {...req.body}
        await articulosCollectionObj.insertOne(newArticulo);
        res.status(200).send({
            message: "el articulo fue añadido exitosamente",
        });


    } catch (error) {
        return res.status(500).send({
            message: `Ocurrio un error durante la solicitud`,
            error: error,
        })
    }

    // const newValue = req.body;
    // const response = [...mappedArticulos, newValue];
    // res.status(201).send(response);
});
//metodo update articulos
app.put('/articulos/:id', async (req, res) => {
    try {
        if(Object.keys(req.body).length === 0){
            return res.status(400).send({
                message: "no pudo añadirse el personaje porque no existe body"
            })
        }
        const articulo = await articulosCollectionObj.findOne({
            id: req.params.id,
        })
        if(!articulo){
            return res.status(404).send({
                message: "no se econtro el personaje",
            })
        }
        const newValue={
            $set:{
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                bio: req.body.bio,
                img: req.body.img,
                familia: req.body.familia               
            }
        }
        const updateOne = await articulosCollectionObj.updateOne({id: req.params.id}, newValue);
        res.status(200).send({
            message: "el articulo actualizo exitosamente",
            articulo: updateOne,
        });

    } catch (error) {
        
    }
    // const doesExist = mappedArticulos.some(
    //     (articulo) => articulo.id === req.params.id);
    // if (!doesExist){
    //     res.status(404).send('No se pudo actilizar el articulo por qe no se encontro el articulo');   
    // }else if(Object.keys(req.body).length === 0) {
    //  res
    //     .status(400)
    //     .send('No se pudo actilizar por que no hay body');
    // }else{
    //     const articulo = mappedArticulos.map((articulo) => {
    //         return articulo.id === req.params.id ? req.body : articulo;
    //     });
    //     res.status(200).send(articulo);
    // }
});
//metodo delete articulos por id
app.delete("/articulos/:id", async (req, res)=>{
    try {
        const articuloDeleteData = await articulosCollectionObj.deleteOne({
            id: req.params.id,
        });
        if(!articuloDeleteData.deletedCount){
            return res.status(404).send({
                message: `no se pudo eliminar el articulo con Id ${req.params.id}`,
            });           
        }
        res.status(200).send({
            message: `el articulo con Id ${req.params.id} fue eliminado exitosamente`,
        });
    } catch (error) {
        return res.status(500).send({
            message: `Ocurrio un error durante la solicitud`,
            error: error,
        })
    }
    // const doesExist = mappedArticulos.some(
    //     (articulo) => articulo.id === req.params.id
    // );
    // if (doesExist){
    //     const articulo = mappedArticulos.filter(
    //         (articulo) => articulo.id !=req.params.id
    //     );
    //     res.status(200).send(articulo);
    // }else{
    //     res.status(404).send("no se pudo  eleminar por que no se encotro el registro")
    // }
    
}
);
