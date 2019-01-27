var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')
var formidable = require('formidable')


// Página inicial (autenticação e registo)
router.get('/', (req, res) => {
  res.render('index')
})

// Login
router.post('/utilizador/login', passport.authenticate('login', {
  successRedirect: '/feed',
  failureRedirect: '/'
}))

// Registo
router.post('/utilizador/registar', passport.authenticate('registar', {
  successRedirect: '/feed',
  failureRedirect: '/'
}))

router.post('/utilizador/logout', verificaAutenticacao, (req, res) => {
  /*req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/')
  })*/
  req.logOut();
  res.redirect('/')
})

function verificaAutenticacao(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect('/')
  }
}

// Página principal
router.get('/feed', verificaAutenticacao, (req, res) => {
  axios.get('http://localhost:2018/api/items?id_utilizador='+req.user._id)
  .then(resposta => res.render('feed', { user: req.user, items: resposta.data.sort((a,b) => a.data>b.data)}))
  .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
})
});

// Lista dos utilizadores
router.get('/utilizadores', function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizadores', { params: req.query })
    .then(resposta=> res.render('utilizadores', { utilizadores: resposta.data, user: req.user }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.get('/utilizador/:email', function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizador/' + req.params.email)
    .then(resposta=> res.render('perfil', { utilizador: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.get('/items', function(req, res, next) {
  axios.get('http://localhost:2018/api/items', { params: req.query })
    .then(resposta=> res.render('eventos', { items: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.post('/item/:iid', function(req, res, next) {
  var participantes = JSON.parse(req.body.participantes)
  console.log(typeof participantes)
  participantes.push(req.user.nome)
  //split("]")[0]+',\"'+req.user.nome+'\"]'
  console.log(participantes)
      axios.put('http://localhost:2018/api/item/'+req.params.iid+'/participantes', participantes)
        .then(resposta=> {console.log(resposta.data); res.redirect('/items')})
        .catch(erro => {
          console.log('Erro ao carregar dados da BD.')
          res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
      })
});

router.get('/utilizador/:uid', function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizador/' + req.params.uid)
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