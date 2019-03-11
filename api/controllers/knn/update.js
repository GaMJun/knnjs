// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const config = require('../../../../config/config');
// const bcrypt = require('bcrypt');
//
// module.exports = {
//     friendlyName: 'Update a ademir',
//     description: 'Modifica um ademir no banco de dados do serviço',
//     extendedDescription: 'Dada as informações passadas por parametros modifica um ademir a uma conta ao banco',
//     moreInfoUrl: 'https://documenter.getpostman.com/view/6350371/RznFqJcf#bd023ea7-399c-4a5b-a5d5-49d6c02dba43',
//     sideEffects: 'cacheable',
//     sync: true,
//     inputs: {
//         headers: {
//             type: 'ref',
//             required: true
//         },
//         ademir_id: {
//             type: 'string',
//             trim: true,
//             required: true,
//             description: 'Id do ademir'
//         },
//         password: {
//             type: 'string',
//             trim: true,
//             required: false,
//             description: 'Senha do ademir'
//         },
//         permission: {
//             type: 'number',
//             trim: true,
//             required: false,
//             description: 'Nível de permissão do ademir'
//         },
//         app: {
//             friendlyName: 'model',
//             type: 'ref',
//             description: 'Aplicação em questão',
//             extendedDescription: 'Esta variável é adicionada pelo roteador e não é necessário passa-la na requisição, ' +
//                 'isto se faz necessário para ter acesso aos modelos do banco',
//             required: true
//         }
//     },
//     exits: {
//         updated: {
//             statusCode: 200,
//             outputExample: {level: 'INFO', message: 'Ademir atualizado com sucesso'},
//             outputFriendlyName: 'Atualizado com sucesso',
//             outputDescription: 'Retorna uma mensagem de sucesso',
//         },
//         badRequest: {
//             statusCode: 400,
//             description: 'Requisição mal formada',
//             outputExample: {
//                 level: 'ERROR',
//                 message: 'Requisição mal formada',
//                 error: 'Parâmetros de modificação mal formados'
//             }
//         },
//         unauthorized: {
//             statusCode: 401,
//             description: 'Token expirado',
//             outputExample: {level: 'ERROR', message: 'Não autorizado', error: 'Token expirado'}
//         },
//         forbidden: {
//             statusCode: 403,
//             description: 'Ação proibida',
//             outputExample: {level: 'ERROR', message: 'Não autorizado', error: 'Esta conta pode acessar isso'}
//         },
//         notFound: {
//             statusCode: 404,
//             description: 'Usuário não cadastrado na plataforma',
//             outputExample: {level: 'ERROR', message: 'Usuário não cadastrado na plataforma'}
//         },
//         sameInfo: {
//             statusCode: 406,
//             description: 'Nada diferente para ser atualizado',
//             outputExample: {level: 'ERROR', message: 'Nada para atualizar aqui'}
//         },
//         internalError: {
//             statusCode: 500,
//             description: 'Erro imprevisto, contate um adminstrador do sistema',
//             outputExample: {
//                 level: 'ERROR',
//                 message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                 error: 'err DO CATCH AQUI'
//             }
//         }
//     },
//     fn: function (inputs, exits) {
//         try {
//             if (mongoose.connection.readyState !== 1) {
//                 mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, function (err) {
//                     if (err) {
//                         return exits.internalError({
//                             level: 'ERROR',
//                             message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                             error: err
//                         });
//                     } else {
//                         //log it
//                     }
//                 })
//             }
//
//             let token = inputs.headers['x-access-token'];
//
//             if (!token) {
//                 return exits.badRequest({
//                     level: 'ERROR',
//                     message: 'Requisição mal formada',
//                     error: 'no-token-found'
//                 });
//             }
//
//             jwt.verify(token, config.secretKey, function (err, decoded) {
//                 if (err) {
//                     return exits.unauthorized({
//                         level: 'ERROR',
//                         message: 'Não autorizado',
//                         error: err
//                     });
//                 } else {
//
//                     let Ademir = inputs.app.models.ademir.account;
//
//                     Ademir.findById(decoded.id, function (err, ademirManagerFound) {
//                         if (err) {
//                             return exits.internalError({
//                                 level: 'ERROR',
//                                 message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                 error: err
//                             });
//                         } else if (ademirManagerFound) {
//                             Ademir.findOne({_id: inputs.ademir_id, manager: decoded.id}, function (err, ademirFound) {
//                                 if (err) {
//                                     return exits.internalError({
//                                         level: 'ERROR',
//                                         message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                         error: err
//                                     });
//                                 } else if (ademirFound) {
//
//                                     let ademirData = {
//                                         password: inputs.password ? bcrypt.hashSync(inputs.password, config.saltRound) : undefined,
//                                         permission: inputs.permission
//                                     };
//
//                                     let isChanged = false;
//
//                                     if (ademirData.password) {
//                                         ademirFound.password = ademirData.password;
//                                         isChanged = true;
//                                     }
//                                     if (ademirData.permission && ademirManagerFound.permission > ademirData.permission) {
//                                         return exits.unauthorized({
//                                             level: 'ERROR',
//                                             message: 'Você não possui permissão suficiente para esta ação',
//                                             error: 'Not enough permission'
//                                         });
//                                     } else if (ademirData.permission !== ademirFound.permission) {
//                                         ademirFound.permission = ademirData.permission;
//                                         isChanged = true;
//                                     }
//                                     if (isChanged) {
//                                         ademirFound.update({$set: ademirFound}, function (err, updatedAdemir) {
//                                             if (err) {
//                                                 return exits.internalError({
//                                                     level: 'ERROR',
//                                                     message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                                     error: err
//                                                 });
//                                             } else if (updatedAdemir) {
//                                                 return exits.updated({
//                                                     level: 'INFO', message: 'Ademir atualizado com sucesso'
//                                                 });
//                                             } else {
//                                                 return exits.notFound({
//                                                     level: 'ERROR',
//                                                     message: 'Nenhum ademir encontrado com o _id fornecido, contate um adminstrador do sistema e informe'
//                                                 });
//                                             }
//                                         });
//                                     } else {
//                                         return exits.sameInfo({
//                                             level: 'ERROR',
//                                             message: 'Nada para atualizar aqui'
//                                         });
//                                     }
//                                 } else {
//                                     return exits.forbidden({
//                                         level: 'ERROR',
//                                         message: 'Ademir a ser atualizado não é subordinado do ademir logado',
//                                         error: 'Invalid ademir_id to update'
//                                     });
//                                 }
//                             });
//                         } else {
//                             return exits.notFound({
//                                 level: 'ERROR',
//                                 message: 'Nenhum ademir encontrado com o token fornecido, contate um adminstrador do sistema e informe'
//                             });
//                         }
//                     });
//                 }
//             });
//         } catch
//             (err) {
//             return exits.internalError({
//                 level: 'ERROR',
//                 message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                 error: err
//             });
//         }
//     }
// };
