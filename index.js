const PORT = 8080;
const express = require("express");
const cors = require("cors");
const api = express();
const multer = require("multer");
const { randomUUID } = require("crypto");
api.use( express.json() );
api.use( cors() );

const upload = multer({ storage: multer.memoryStorage() });

const IMAGE_PATH = "C:\\images";

const usuarios = [
    {id: 1, username: "jon@email.com", password: "123456" },
    {id: 2, username: "maria@email.com", password: "abcdef" },
    {id: 3, username: "pedro@email.com", password: "ghijkl" }
]

const pets = [
    {id: 1, nome: "Rex", tipo: "Cachorro", raca: "Labrador", nascimento: "2018-06-15"},
]

api.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
})

let indicePet = 3;

api.get("/", (req, res) => {
    console.log("Acessou a raiz da API");
    res.send("Hello World!");
})

api.post("/pets/upload/:id", upload.single("imagem"), 
(request, response) => {
    const id = parseInt(request.params.id);
    const tipo = request.query.tipo;

    if (request.file) {
        console.log("Recebeu o arquivo: ", request.file);
        const nomeImagem = randomUUID() + "." + tipo;
        console.log("Nome da imagem gerada: ", nomeImagem);

    } else {
        console.log("Nenhum arquivo recebido.");
    }
});


api.get("/pets", (req, res) => {
    console.log("Acessou a lista de pets");
    res.send(pets);
})

api.post("/pets", (req, res) => {
    req.body.id = indicePet++;
    pets.push(req.body);

    res.status(201).send();
});

api.delete("/pets/:id", (request, response) => {
    const id = parseInt(request.params.id)
    const novoPets = pets.filter( ( pet ) => pet.id !== id );
    if (novoPets.length  == pets.length ) { 
        response.json( {status: "erro"} );
    } else { 
        pets.splice(0, pets.length);
        pets.push(...novoPets);
        response.json( {status: "ok"} );
    }
});

api.put("/pets/:id", (request, response) => {
    const id = parseInt(request.params.id);
    let encontrado = false;
    for(let i = 0; i < pets.length; i++) { 
        const pet = pets[i];
        if (pet.id == id) { 
            request.body.id = id;
            pets[i] = request.body
            encontrado = true;
            break;
        }
    }
    if (encontrado) { 
        response.json( {status: "ok"} );
    } else {
        response.json( {status: "erro"} );
    }
});

api.listen( PORT, ()=>{
    console.log(`Servidor iniciado na porta ${PORT}`);
} );