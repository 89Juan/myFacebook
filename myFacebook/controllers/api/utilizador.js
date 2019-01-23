var Utilizador = require('../../models/utilizador')
var Item = require('../../models/item')

// Lista de utilizadores
module.exports.listarUt = () => {
    return Utilizador
        .find()
        .exec()
}

// Devolve informação de um utilizador
module.exports.consultar = uid => {
    return Utilizador
        .findOne({_id: uid})
        .exec()
}

// Listar publicações de um utilizador
module.exports.listarItems = (uid) => {
    return Item
        .find({id_utilizador: uid})
        .sort({data: -1})
        .exec()
}

// Insere utilizador
module.exports.inserir = utilizador => {
    return Utilizador.create(utilizador)
}

// Atualiza utilizador
module.exports.atualizar = (uid,utilizador) => {
    return Utilizador
        .findOne({_id: uid})
        .update(utilizador)
        .exec()
}

// Remove utilizador
module.exports.remover = (uid) => {
    return Utilizador
        .remove({_id: uid})
        .exec()
}

/*TODO: VER ISTO*/

// Autenticar
module.exports.autenticar = (email, password, callback) => {
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}
