var mongoose = require('mongoose')
var Schema = mongoose.Schema

/*TODO: VER ISTO*/

var AlbumSchema = new Schema({
    fotos: {type: [String], required: true}
})

var EventoSchema = new Schema({
    participantes: {type: [String]},
    dataInicio: {type: String, required: true},
    dataFim: {type: String, required: true}
})

var TipoSchema = new Schema({
    album: AlbumSchema,
    ideia: {type: String},
    evento: EventoSchema
})

var ComentarioSchema = new Schema({
    id_utilizador: {type: String, required: true},
    descricao: {type: String, required: true},
    data: {type: String, required: true},
    gostos: {type: Number, required: true}
})

var ItemSchema = new Schema({
    id_utilizador: {type: String, required: true},
    titulo: {type: String, required: true},
    data: {type: String, required: true},
    tipo: TipoSchema,
    local: {type: String},
    elementos: {type: [String], required: true},
    privacidade: {type: String, required: true},
    gostos: {type: Number, required: true},
    comentarios: [ComentarioSchema], 
    descritores: {type: [String]},
    descricao: {type: String}
})

module.exports = mongoose.model('Item', ItemSchema, 'itens') // Nome que se quer dar ao modelo, schema, coleção da BD