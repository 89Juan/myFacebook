var express = require('express')
var router = express.Router()
var Item = require('../../controllers/api/item')

// API para os items

router.get('/items', (req,res) => {
    Item.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de utilizadores.'))
})

router.get('/item/:iid', (req,res) => {
    Item.consultar(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta de um utlizador.'))
})

router.get('/item/:iid/comentarios', (req,res) => {
    Item.listarComentarios(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem das publicações do utilizador.'))
})

router.post('/item/:iid/comentario', (req, res)=>{
    Item.inserirComentario(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na inserção de um utilizador.'))
})

router.put('/item/:id/comentario/:cid', (req, res)=>{
    Item.atualizaComentario(req.params.id, req.param.cid, req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na inserção de um utilizador.'))
})

router.delete('/item/:iid/comentario/:cid', (req, res)=>{
    Item.remover(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na remoção de um utilizador.'))
})

router.post('/item/:iid', (req, res)=>{
    Item.atualizaItem(req.params.iid, req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na atualização de um utilizador.'))
})

router.put('/item/:iid', (req, res)=>{
    Item.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na atualização de um utilizador.'))
})

router.post('/item/:iid/like', (req, res)=>{
    Item.like(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na atualização de um utilizador.'))
})

router.delete('/item/:iid/like', (req, res)=>{
    Item.dislike(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na atualização de um utilizador.'))
})

router.delete('/item/:iid', (req, res)=>{
    Item.removerItem(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na remoção de um utilizador.'))
})

module.exports = router