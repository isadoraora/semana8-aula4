//declarando as variaveis e importando metodos e arquivos
const express = require('express');
const app = express();
const port = 3000;
const filmes = require('./filmes.json')
const fs = require('fs')



//startando o servidor
app.listen(port, function () {
    console.log(`App rodando na porta ${port}`)
})

app.use(express.json());

//criando o middleware
app.all('*', (req, res, next) => {
    next()
})


//rotinhas
//rota pra retornar o Hello
app.get('/', (req, res) => {
    res.send('Hello ma friend')
})

//retorna todo json
app.get('/filmes', (req, res) => {
    res.send(filmes)
})

//retorna apenas os nomes dos diretores
app.get('/:director', (req, res)=>{
    const {director} = req.params
    const listFilms = filmes.filter(f => f.director == director)

    return res.status(200).send(listFilms)
})


//lista de filmes de um gênero especifico
app.get('/filmes/genero/:nome', (req, res) => {
    const genero = req.params.nome
    res.send(filmes.filter(filme => filme.genre.indexOf(genero) > -1))
})
//const choosengenre = req.params.genre
//constlistFilms = filmes.filter(e => e.genre.includes(choosenGenre))

//crie um novo filme e salve o resultado 
app.post('/filmes', (req, res) => {
    const { title, year, director, duration, genre, rate } = req.body
    filmes.push({ title, year, director, duration, genre, rate })
    //savefiles()
    fs.writeFile('./filmes.json', JSON.stringify(filmes), 'utf8', function (err) {
        if (err) {
            return res.status(500).send({ message: err })
        }
        console.log('Arquivo salvo, babe!')
    })
    return res.status(201).send(filmes)
})

//crie uma rota post que add novo gênero a um filme já existente 

app.post('/filmes/:titulo/genero', (req, res) => {
    const filmeExistente = req.params.titulo
    const filminho = filmes.find(f => f.title.indexOf(filmeExistente) > -1)
    const { genre } = req.body;
    filminho.genre.push(genre);

    fs.writeFile("./filmes.json", JSON.stringify(filmes), 'utf8', function (err) {
        if (err) {
            return res.status(500).send({ message: err });
        }
        console.log("Arquivo salvo!");
    });

    return res.status(201).send(filmes);
})

app.post('/:filmes/image', (req, res) => {

})

//funcao para save files
