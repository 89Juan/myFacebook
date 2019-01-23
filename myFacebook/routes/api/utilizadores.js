var express = require('express')
var router = express.Router()
var Utilizador = require('../../controllers/api/utilizador')

// API para os utilizadores

router.get('/utilizadores', (req,res) => {
    Utilizador.listarUt()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de utilizadores.'))
})

router.get('/utilizador/:uid', (req,res) => {
    Utilizador.consultar(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta de um utlizador.'))
})

router.get('/utilizador/:uid/publicacoes', (req,res) => {
    Utilizador.listarItems(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem das publicações do utilizador.'))
})

router.post('/utilizador', (req, res)=>{
    Utilizador.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na inserção de um utilizador.'))
})

router.put('/utilizador/:uid', (req, res)=>{
    Utilizador.atualizar(req.params.uid,req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na atualização de um utilizador.'))
})

router.delete('/utilizador/:uid', (req, res)=>{
    Utilizador.remover(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na remoção de um utilizador.'))
})

module.exports = router