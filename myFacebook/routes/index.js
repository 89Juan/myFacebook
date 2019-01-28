var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')
var bcrypt = require('bcrypt')
var fs = require('fs')
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
router.get('/feed', verificaAutenticacao, async(req, res) => {
  var items
  await axios.get('http://localhost:2018/api/items').then(r => items = r.data)
  .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  });

  var evento = await items.filter(i => i.tipo.dataInicio).sort((a,b) => (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0));
  if (evento.length > 0)
    evento = evento[0]
  else 
    evento = undefined

  var users
  await axios.get('http://localhost:2018/api/utilizadores', { params: req.query })
    .then(resposta=> users = resposta.data)
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
  })

  axios.get('http://localhost:2018/api/items?id_utilizador='+req.user._id)
  .then(resposta => res.render('feed', { user: req.user, items: resposta.data.sort((a,b) => (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0)), evento: evento, users: users }))
  .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
})
});

// Lista dos utilizadores
router.get('/utilizadores', verificaAutenticacao, function(req, res, next) {
  axios.get('http://localhost:2018/api/utilizadores', { params: req.query })
    .then(resposta=> res.render('utilizadores', { utilizadores: resposta.data, user: req.user }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.get('/utilizador/:uid', verificaAutenticacao, async function(req, res, next) {
  var items
  await axios.get('http://localhost:2018/api/items?id_utilizador='+req.params.uid, { params: req.query })
    .then(resposta=> items = resposta.data.sort((a,b) => (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0)))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
  })

  var itemsT
  await axios.get('http://localhost:2018/api/items').then(r => itemsT = r.data)
  .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  });

  var evento = itemsT.filter(i => i.tipo.dataInicio).sort((a,b) => (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0));
  if (evento.length > 0)
    evento = evento[0]
  else 
    evento = undefined

  var users
  await axios.get('http://localhost:2018/api/utilizadores', { params: req.query })
    .then(resposta=> users = resposta.data)
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
  })

  axios.get('http://localhost:2018/api/utilizador/' + req.params.uid)
    .then(resposta=> res.render('utilizador', { user: resposta.data, items: items, viewer: req.user, evento: evento, users: users}))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.get('/eventos', verificaAutenticacao, async function(req, res, next) {
  var users
  await axios.get('http://localhost:2018/api/utilizadores', { params: req.query })
    .then(resposta=> users = resposta.data)
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
  })
  axios.get('http://localhost:2018/api/items', { params: req.query })
    .then(resposta=> res.render('eventos', { items: resposta.data, users: users }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
});

router.post('/item/:iid', verificaAutenticacao, function(req, res, next) {
  var participantes = JSON.parse(req.body.participantes)
  participantes.push(req.user._id)
      axios.put('http://localhost:2018/api/item/'+req.params.iid+'/participantes', participantes)
        .then(() => res.redirect('/eventos'))
        .catch(erro => {
          console.log('Erro ao carregar dados da BD.')
          res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
      })
});

router.get('/editarPerfil', verificaAutenticacao, function(req, res, next) {
  res.render('editarPerfil', {user: req.user})
});

router.post('/utilizador/:uid', async function(req, res) {
  var nome = req.body.nome
  if (nome == '')
    nome = req.user.nome
  var password = req.body.password
  if (password == '')
    password = req.user.password
  else
    password = await bcrypt.hash(password, 10)
  var dataNasc = req.body.dataNasc
  if (dataNasc == '')
    dataNasc = req.user.dataNasc
  var morada = req.body.morada
  if (morada == '')
    morada = req.user.morada
  var sexo = req.body.sexo
  if (!sexo)
    sexo = req.user.sexo
  axios.put('http://localhost:2018/api/utilizador/' + req.params.uid, {nome, password, dataNasc, morada, sexo})
    .then(() => res.redirect('/feed')) 
    .catch(erro => {
      console.log('Erro ao inserir dados na BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
    })
});

router.get('/album', verificaAutenticacao, function(req, res, next) {
  res.render('album', {user: req.user})
});

router.get('/evento', verificaAutenticacao, function(req, res, next) {
  res.render('evento', {user: req.user})
});

router.post('/album', verificaAutenticacao, function(req, res, next) {
  var form = new formidable.IncomingForm()
  form.parse(req, (erro, fields, files) => {
    var fenviado1 = files.foto1.path
    var fnovo1 = './public/images/'+ files.foto1.name
    fs.rename(fenviado1, fnovo1, erro => {})
    var fenviado2 = files.foto2.path
    var fnovo2 = './public/images/'+ files.foto2.name
    fs.rename(fenviado2, fnovo2, erro => {})
    var fenviado3 = files.foto3.path
    var fnovo3 = './public/images/'+ files.foto3.name
    fs.rename(fenviado3, fnovo3, erro => {})
    var titulo = fields.titulo
    var descricao = fields.descricao
    var fotos = []
    var foto1 = files.foto1.name
    var foto2 = files.foto2.name
    var foto3 = files.foto3.name
    if (foto1 != "")
      fotos.push(foto1)
    if (foto2 != "")
      fotos.push(foto2)
    if (foto3 != "")
      fotos.push(foto3)
    var tipo = {fotos: fotos}
    var descritores = []
    if (fields.descritores != "")
      descritores = fields.descritores.split(" ")
    var privacidade
    if (fields.privacidade == "true")
      privacidade = true
    else
      privacidade = false
    var local = req.body.local
    var id_utilizador = req.user._id
    axios.post('http://localhost:2018/api/item', {id_utilizador, titulo, tipo, local, privacidade, descritores, descricao})
      .then(() => res.redirect('/feed'))
      .catch(erro => {
        console.log('Erro ao carregar dados da BD.')
        res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
    })
  })
});

router.post('/evento', verificaAutenticacao, function(req, res, next) {
  var titulo = req.body.titulo
  var descricao = req.body.descricao
  var participantes = []
  participantes.push(req.user._id)
  var dataInicio = req.body.dataInicio
  var dataFim = req.body.dataFim
  var descritores = []
  if (req.body.descritores != "")
    descritores = req.body.descritores.split(" ")
  var local = req.body.local
  if (req.body.privacidade == "true")
    privacidade = true
  else
    privacidade = false
  var id_utilizador = req.user._id
  var tipo = {participantes: participantes, dataInicio: dataInicio, dataFim: dataFim}
    axios.post('http://localhost:2018/api/item', {id_utilizador, titulo, tipo, local, privacidade, descritores, descricao})
      .then(() => res.redirect('/feed'))
      .catch(erro => {
        console.log('Erro ao carregar dados da BD.')
        res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
    })
});

router.post('/item/:iid/eliminar', verificaAutenticacao, function(req, res, next) {
  axios.delete('http://localhost:2018/api/item/'+req.params.iid)
    .then(() => res.redirect('/feed'))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  })
});

router.get('/item/:iid/editar', verificaAutenticacao, function(req, res, next) {
  axios.get('http://localhost:2018/api/item/'+req.params.iid)
    .then(resposta => res.render('editarPublicacao', {item: resposta.data}))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  })
});

router.post('/item/:iid/editar', verificaAutenticacao, async function(req, res, next) {
  await axios.get('http://localhost:2018/api/item/'+req.params.iid)
    .then(resposta => item = resposta.data)
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  })
  var titulo = req.body.titulo
  if (titulo == "")
    titulo = item.titulo
  var descricao = req.body.descricao
  if (descricao == "")
    descricao = item.descricao
  var descritores = []
  if (req.body.descritores != "")
    descritores = req.body.descritores.split(" ")
  if (descritores.length == 0)
    descritores = item.descritores
  var privacidade
  if (req.body.privacidade == "true")
    privacidade = true
  else if (req.body.privacidade == "false")
    privacidade = false
  else
    privacidade = item.privacidade
  if (req.body.dataInicio != null) {
    var local = req.body.local
    if (local == "" && item.local != null)
      local = item.local
    var dataInicio = req.body.dataInicio
    if (dataInicio == "")
      dataInicio = item.tipo.dataInicio
    var dataFim = req.body.dataFim
    if (dataFim == "")
      dataFim = item.tipo.dataFim
    var participantes = item.tipo.participantes
    var tipo = {participantes: participantes, dataInicio: dataInicio, dataFim: dataFim}
  }
  else
    var tipo = 'Ideia' 
  axios.put('http://localhost:2018/api/item/'+req.params.iid, {titulo, tipo, local, privacidade, descritores, descricao})
    .then(() => res.redirect('/feed'))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  })
});

router.post('/item/:iid/editarAlbum', verificaAutenticacao, async function(req, res, next) {
  await axios.get('http://localhost:2018/api/item/'+req.params.iid)
    .then(resposta => item = resposta.data)
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
  })
  var form = new formidable.IncomingForm()
  form.parse(req, (erro, fields, files) => {
    var titulo = fields.titulo
    if (titulo == "")
      titulo = item.titulo
    var descricao = fields.descricao
    if (descricao == "")
      descricao = item.descricao
    var descritores = []
    if (fields.descritores != "")
      descritores = fields.descritores.split(" ")
    if (descritores.length == 0)
      descritores = item.descritores
    var privacidade
    if (fields.privacidade == "true")
      privacidade = true
    else if (fields.privacidade == "false")
      privacidade = false
    else
      privacidade = item.privacidade
    var local = fields.local
    if (local == "")
      local = item.local
    var fenviado1 = files.foto1.path
    var fnovo1 = './public/images/'+ files.foto1.name
    fs.rename(fenviado1, fnovo1, erro => {})
    var fenviado2 = files.foto2.path
    var fnovo2 = './public/images/'+ files.foto2.name
    fs.rename(fenviado2, fnovo2, erro => {})
    var fenviado3 = files.foto3.path
    var fnovo3 = './public/images/'+ files.foto3.name
    fs.rename(fenviado3, fnovo3, erro => {})
    var fotos = item.tipo.fotos
    var foto1 = files.foto1.name
    var foto2 = files.foto2.name
    var foto3 = files.foto3.name
    if (foto1 != "")
      fotos.push(foto1)
    if (foto2 != "")
      fotos.push(foto2)
    if (foto3 != "")
      fotos.push(foto3)
    var tipo = {fotos: fotos}
    axios.put('http://localhost:2018/api/item/'+req.params.iid, {titulo, tipo, local, privacidade, descritores, descricao})
    .then(() => res.redirect('/feed'))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
    })
  })
});

router.post('/editarFotoPerfil', verificaAutenticacao, function(req, res, next) {
  var form = new formidable.IncomingForm()
  form.parse(req, (erro, fields, files) => {
    var fenviado = files.foto.path
    var fnovo = './public/images/'+ files.foto.name
    fs.rename(fenviado, fnovo, erro => {})
    var foto = files.foto.name
    var nome = req.user.nome
    var password = req.user.password
    var dataNasc = req.user.dataNasc
    var morada = req.user.morada
    var sexo = req.user.sexo
    axios.put('http://localhost:2018/api/utilizador/' + req.user._id, {nome, password, dataNasc, morada, sexo, foto})
      .then(() => res.redirect('/feed')) 
      .catch(erro => {
        console.log('Erro ao inserir dados na BD.')
        res.render('error', {error: erro, message: erro+"Erro ao carregar dados da BD."})
      })
  })
});

module.exports = router;