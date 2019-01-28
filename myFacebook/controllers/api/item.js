var Item = require('../../models/item')

// Lista de itens
module.exports.listar = (query) => {
    return Item
        .find(query)
        .exec()
}

// Devolve um item
module.exports.consultar = iid => {
    return Item
        .findOne({_id: iid})
        .exec()
}

// Listar comentários de um item
module.exports.listarComentarios = (iid) => {
    return Item
        .findOne({_id: iid}, {comentarios: 1})
        .sort({data: 1})
        .exec()
}

// Insere comentário num item
module.exports.inserirComentario = (iid,comentario) => {
    return Item
        .update({_id: iid},
                {$push: {comentarios: comentario}})
        .exec()
}

// Atualiza comentário num item
module.exports.atualizaComentario = (iid, comentario) => {
    return Item
        .update({_id: iid},
                {$set: {'comentario.$.descricao': comentario.descricao}})
        .exec()
}

// Adiciona like
module.exports.like = (iid) => {
    return Item
        .update({_id: iid},
                {$inc: {gostos: 1}})
        .exec()
}

// Remove like
module.exports.dislike = (iid) => {
    return Item
        .update({_id: iid},
                {$inc: {gostos: -1}})
        .exec()
}

// Remover um comentário
module.exports.removerComentario = (iid,comentario) => {
    return Item
    .update({_id: iid},
        {$pull: {comentarios: comentario}})
    .exec()
}

// Adiciona um item
module.exports.inserir = item => {
    return Item.create(item)
}

// Atualiza um item
module.exports.atualizaItem = (iid, item) => {
    return Item
        .update({_id: iid},
                {$set:item})
        .exec()
}

// Atualiza os participantes de um item
module.exports.atualizaItemParticipantes = (iid, participantes) => {
    return Item
        .update({_id: iid},
                {$set:{'tipo.participantes':participantes}})
        .exec()
}

// Remove um item
module.exports.removerItem = (iid) => {
    return Item
    .remove({_id: iid})
    .exec()
    }