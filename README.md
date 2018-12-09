# MyFacebook

Trabalho DAW 18/19

## Requisitos

Atributos com um asterisco são obrigatórios:

### Utilizador

- Email*
- Password*
- Nome*
- Data Nascimento*
- Morada
- Sexo*

### Item

- Id utilizador*
- Título*
- Data*
- [Tipo*](#tipos)
- Local
- Elementos*
- Privacidade*
- Gostos*
- [Comentários](#Comentario)
- Descritores
- Descrição

### <a name="Descritores"></a>Descritores

- Nome*
- Items

### <a name="Comentario"></a>Comentário

- Id utilizador
- Descrição
- Data
- Gostos

## <a name="Tipos"></a> Tipos

Atributos com um asterisco são obrigatórios:

#### Álbum fotográfico

- Fotos*

#### Ideia

#### Evento

- Participantes
- Data ínicio*
- Data fim*


## Rotas

### Autenticação

| Rota                   | Formato                                                              | Resposta Sucesso                                                      | Resposta Erro       | Descrição             |
|------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------|---------------------|-----------------------|
| `POST /api/user/register`  |  `{  email: String,  password: String,  nome: String,  sexo: String }` |  `{  email: String,  password: String,  nome: String,  sexo: String  }` |  `{  erro: String }`  | Registar utilizador   |
| `POST /api/user/login`     |  `{  email: String,  password: String }`                               |  `{  email: String,  password: String }`                                |  `{  erro: String  }` | Autenticar utilizador |
| `POST /api/user/logout`    |  `{ }`                                                                 |  `{ }`                                                                  |  `{  erro: String  }` | Terminar sessão       |

### Utilizador

| Rota                     | Formato                                                                                             | Resposta Sucesso                                                                                    | Resposta Erro       | Descrição                                                            |
|--------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|---------------------|----------------------------------------------------------------------|
| `GET /api/users`         | -                                                                                                   |  `{  users: [User] }`                                                                                 |  `{  erro: String }`  | Lista de utilizadores                                                |
| `GET /user/:id`          | -                                                                                                   | `{  user: User }`                                                                                     | `{  erro: String }`   | Obter um utilizador                                                  |
| `GET /user/publicacoes/` | -                                                                                                   | `{  pubs: [Item] }`                                                                                   | `{  erro: String }`   |  Lista publicações relativas a todos utilizador segundo um descritor |
| `POST /user`             | `{  email: String,  password: String,  nome: String,  nasc: String,  sexo: String }`                  | `{  email: String,  password: String,  nome: String,  nasc: String,  sexo: String }`                  |  `{  erro: String  }` | Adicionar um utilizador                                              |
| `PUT /user/:id`          | `{  email: String,  password: String,  nome: String,  nasc: String,  morada: String,  sexo: String }` | `{  email: String,  password: String,  nome: String,  nasc: String,  morada: String,  sexo: String }` |  `{  erro: String }`  | Atualizar informação de um utilizador                                |
| `DELETE /user/:id`       | -                                                                                                   | `{  email: String,  password: String,  nome: String,  nasc: String,  morada: String,  sexo: String }` | `{  erro: String }`   | Remove um utilizador                                                 |

### Item

| Rota                          | Formato                                                                                                                                       | Resposta Sucesso                                                                                                                                                                           | Resposta Erro       | Descrição                                |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|------------------------------------------|
| `GET /items`                  | -                                                                                                                                             | `{  items: [Item] }`                                                                                                                                                                         | `{  erro: String }`   | Lista de items                           |
| `GET /item/:id`               | -                                                                                                                                             | `{  item: Item }`                                                                                                                                                                            | `{  erro: String }`   | Obter um item                            |
| `GET /item/:id/comentarios`   | -                                                                                                                                             | `{  comentarios: [Comentario] }`                                                                                                                                                             | `{  erro: String }`   | Lista de comentários relativos a um item |
| `POST /item/:id/comentario`   | `{  descricao: String }`                                                                                                                        | `{  descricao: String }`                                                                                                                                                                     | `{  erro: String }`   | Adiciona um comentário a um item         |
| `PUT /item/:id/comentario`    | `{  descricao: String }`                                                                                                                        | `{  descricao: String,  data: String,  gostos: Number }`                                                                                                                                     | `{  erro: String }`   | Editar um comentário                     |
| `DELETE /item/:id/comentario` | -                                                                                                                                             | `{  descricao: String }`                                                                                                                                                                     | `{  erro: String }`   | Remover um comentário                    |
| `POST /item`                  | `{  titulo: String,  tipo: String,  local: String,  elementos: [Elemento],  privacidade: Boolean,  descritores: [String],  descricao: String }` | `{  titulo: String,  tipo: String,  local: String,  elementos: [Elemento],  privacidade: Boolean,  gostos: Number,  comentarios: [Comentario],  descritores: [String],  descricao: String }` |  `{  erro: String }`  | Adicionar um item                        |
| `POST /item/:id/like`         | -                                                                                                                                             | `{  titulo: String,  tipo: String,  local: String,  elementos: [Elemento],  privacidade: Boolean,  gostos: Number,  comentarios: [Comentario],  descritores: [String],  descricao: String }` |  `{  erro: String }`  | Alternar entre gosto/desgosto            |
| `PUT /item/:id`               | `{  titulo: String,  tipo: String,  local: String,  elementos: [Elemento],  privacidade: Boolean,  descritores: [String],  descricao: String }` | `{  titulo: String,  tipo: String,  local: String,  elementos: [Elemento],  privacidade: Boolean,  gostos: Number,  comentarios: [Comentario],  descritores: [String],  descricao: String }` |  `{  erro: String  }` | Atualizar informação de um item          |
| `DELETE /item/:id`            | -                                                                                                                                             | `{  titulo: String,  tipo: String,  local: String,  elementos: [Elemento],  privacidade: Boolean,  gostos: Number,  comentarios: [Comentario],  descritores: [String],  descricao: String }` |  `{  erro: String  }` | Remove um item                           |
