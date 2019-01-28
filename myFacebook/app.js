var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var utilizadoresAPIRouter = require('./routes/api/utilizadores');
var itemsAPIRouter = require('./routes/api/items');

var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var axios = require('axios')
var UserModel = require('./models/utilizador')


var app = express();


// Registo de um utilizador
passport.use('registar', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
      var nome = req.body.nome
      var dataNasc = req.body.dataNasc
      var morada = req.body.morada
      var sexo = req.body.sexo
      var user = await UserModel.create({email, password, nome, dataNasc, morada, sexo})
      return done(null, user)
  }
  catch(error) {
      return done(null, false, {message: 'ERRO: O email inserido já está a ser utilizado!'})
  }
}))

// Login de utilizadores
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
      var user = await UserModel.findOne({email})
      if (!user) 
          return done(null, false, {message: 'Utilizador não existe!'})
      var valid = await user.isValidPassword(password)
      if (!valid)
          return done(null, false, {message: 'Password inválida!'})
      return done(null, user, {message: 'Login feito com sucesso.'})
  }
  catch(error) {
      return done(error)
  }
}))

// Serialização do utilizador (Codificação)
passport.serializeUser((user, done) => {
  done(null, user.email)
})

// Deserialização do utilizador (Codificação)
passport.deserializeUser((email, done) => {
  axios.get('http://localhost:2018/api/utilizador/login/' + email)
    .then(dados => done(null, dados.data))
    .catch(erro => done(erro, false))
})

// Middleware da Sessão
app.use(session({
  genid: req => {
    console.log('Dentro do middleware da sessão: ' + req.sessionID)
    return uuid()
  },
  store: new FileStore(), // para guardar a sessão na parte do servidor quando este vai abaixo
  secret: 'myFacebook',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


// Base de Dados
mongoose.connect('mongodb://127.0.0.1:27017/myFacebook', {useNewUrlParser: true})
  .then(()=> console.log('Mongo ready: ' + mongoose.connection.readyState))
  .catch(()=> console.log('Mongo: erro na conexão.'))


const { exec } = require('child_process');

function mongoimport(collection) {
  exec('mongoimport --db myFacebook --collection '+collection+' --file ./files/'+collection+'.json --jsonArray', (err, stdout, stderr) => {
    if (err) {
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

mongoimport('utilizadores')
mongoimport('items')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/', utilizadoresAPIRouter);
app.use('/api/', itemsAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
