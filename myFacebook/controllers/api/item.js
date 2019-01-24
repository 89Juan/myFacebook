var Item = require('../../models/item')

// Lista de itens
module.exports.listar = () => {
    return Item
        .find()
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
module.exports.inserir = (iid,comentario) => {
    return Item
        .update({_id: iid},
                {$push: {comentarios: comentario}})
        .exec()
}

// Atualiza comentário num item


// Remover um comentário
module.exports.remover = (iid,comentario) => {
    return Item
    .update({_id: iid},
        {$pull: {comentarios: comentario}})
    .exec()
}

// Adiciona um item
module.exports.inserir = item => {
    return Item.create(item)
}