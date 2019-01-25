var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')


var UtilizadorSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nome: {type: String, required: true},
    dataNasc: {type: String, required: true},
    morada: {type: String},
    sexo: {type: String, required: true}
})

UtilizadorSchema.pre('save', async function (next) {
  var hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

UtilizadorSchema.methods.isValidPassword = async function (password) {
  var user = this
  var compare = await bcrypt.compare(password, user.password)
  return compare
}


module.exports = mongoose.model('Utilizador', UtilizadorSchema, 'utilizadores')