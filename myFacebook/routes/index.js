var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.get('/utilizadores', function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizadores')
    .then(resposta=> res.render('utilizadores', { utilizadores: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.get('/utilizador/:uid', function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizadores/' + req.params.uid)
    .then(resposta=> res.render('utilizador', { utilizador: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.get('/utilizador/:uid/publicacoes', function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizador/' + req.params.uid + '/publicacoes')
    .then(resposta=> res.render('publicacoes', { publicacoes: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.post('/utilizador', function(req, res) {
  axios.post('http://localhost:2018/api/utilizadores', req.body)
    .then(()=> res.redirect('http://localhost:2018/utilizadores')) 
    .catch(erro => {
      console.log('Erro ao inserir dados na BD.')
      res.redirect('http://localhost:2018/utilizadores')
    })
});

router.put('/utilizador/:uid', function(req, res) {
  axios.put('http://localhost:2018/api/utilizadores/' + req.params.uid, req.body)
    .then(()=> res.redirect('http://localhost:2018/utilizadores')) 
    .catch(erro => {
      console.log('Erro ao inserir dados na BD.')
      res.redirect('http://localhost:2018/utilizadores')
    })
});

router.delete('/utilizador/:uid', function(req, res) {
  axios.delete('http://localhost:2018/api/utilizadores/' + req.params.uid)
    .then(()=> res.redirect('http://localhost:2018/utilizadores')) 
    .catch(erro => {
      console.log('Erro ao inserir dados na BD.')
      res.redirect('http://localhost:2018/utilizadores')
    })
});

module.exports = router;
