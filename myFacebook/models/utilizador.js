var mongoose = require('mongoose')
var Schema = mongoose.Schema

/*TODO: VER ISTO*/

var UtilizadorSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nome: {type: String, required: true},
    dataNasc: {type: String, required: true},
    morada: {type: String},
    sexo: {type: String, required: true}
})

//hashing a password before saving it to the database
UtilizadorSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) { return next(err); }
        user.password = hash;
        next();
      });
    });
  });
  
  /**
   * Helper method for validating user's password.
   */
  UtilizadorSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  };
  


module.exports = mongoose.model('Utilizador', UtilizadorSchema, 'utilizadores') // Nome que se quer dar ao modelo, schema, coleção da BD