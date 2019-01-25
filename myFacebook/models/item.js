var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AlbumSchema = new Schema({
    fotos: {type: [String], required: true}
})

var EventoSchema = new Schema({
    participantes: {type: [Schema.Types.ObjectId], ref: 'Utilizador', required: true},
    dataInicio: {type: String, required: true},
    dataFim: {type: String, required: true}
})

var ComentarioSchema = new Schema({
    id_utilizador: {type: Schema.Types.ObjectId, ref: 'Utilizador', required: true},
    descricao: {type: String, required: true},
    data: {type: String},
    gostos: {type: Number, default: 0}
})

var ItemSchema = new Schema({
    id_utilizador: {type: Schema.Types.ObjectId, ref: 'Utilizador', required: true},
    titulo: {type: String, required: true},
    data: {type: String},
    tipo: {type: Schema.Types.Mixed, enum: [AlbumSchema, EventoSchema, 'Ideia'], default: 'Ideia'},
    local: {type: String},
    elementos: {type: [String], required: true},
    privacidade: {type: Boolean, default: false},
    gostos: {type: Number, default: 0},
    comentarios: {type: [ComentarioSchema], default: []}, 
    descritores: {type: [String]},
    descricao: {type: String}
})

module.exports = mongoose.model('Item', ItemSchema, 'items') // Nome que se quer dar ao modelo, schema, coleção da BD