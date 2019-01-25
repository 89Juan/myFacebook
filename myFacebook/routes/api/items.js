var express = require('express')
var router = express.Router()
var Item = require('../../controllers/api/item')

// API para os items

router.get('/items', (req,res) => {
    Item.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na listagem de itemes.'))
})

router.get('/item/:iid', (req,res) => {
    Item.consultar(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na consulta de um item.'))
})

router.get('/item/:iid/comentarios', (req,res) => {
    Item.listarComentarios(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na listagem das publicações do item.'))
})

router.post('/item/:iid/comentario', (req, res)=>{
    Item.inserirComentario(req.params.iid, req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na inserção de um comentario.'))
})
/*
// ESTA MAL
router.put('/item/:id/comentario/', (req, res)=>{
    Item.atualizaComentario(req.params.id, req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na atualização de um comentario.'))
})

// ESTA MAL
router.delete('/item/:iid/comentario/', (req, res)=>{
    Item.remover(req.params.iid, req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na remoção de um comentario.'))
})
*/
router.put('/item/:iid', (req, res)=>{
    Item.atualizaItem(req.params.iid, req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na atualização de um item.'))
})

router.post('/item', (req, res)=>{
    Item.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na atualização de um item.'))
})

router.post('/item/:iid/like', (req, res)=>{
    Item.like(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na inserção de um like.'))
})

router.delete('/item/:iid/like', (req, res)=>{
    Item.dislike(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na remoção de um like.'))
})

router.delete('/item/:iid', (req, res)=>{
    Item.removerItem(req.params.iid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro+'Erro na remoção de um item.'))
})

module.exports = router