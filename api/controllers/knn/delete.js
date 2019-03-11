// const mongoose = require('mongoose');
// const config = require('../../../../config/config');
// const jwt = require('jsonwebtoken');
//
// module.exports = {
//     friendlyName: 'Hard delete a ademir',
//     description: 'Remove uma ademir no banco',
//     extendedDescription: 'Remove um ademir e realoca seus subordinados a outro ademir',
//     moreInfoUrl: 'https://documenter.getpostman.com/view/6350371/RznFqJcf#4a38bdc1-17d0-46c9-a97f-4980f3183f6f',
//     sideEffects: 'cacheable',
//     sync: true,
//     inputs: {
//         headers: {
//             type: 'ref',
//             required: true
//         },
//         ademir_id: {
//             type: 'string',
//             required: true
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
//         deleted: {
//             statusCode: 200,
//             outputExample: {level: 'INFO', message: 'Conta deletada com sucesso!'},
//             outputFriendlyName: 'Excluido com sucesso',
//             outputDescription: 'Retorna uma mensagem de sucesso',
//         },
//         badRequest: {
//             statusCode: 400,
//             description: 'Requisição mal formada',
//             outputExample: {
//                 level: 'ERROR',
//                 message: 'Requisição mal formada',
//                 error: 'Parâmetros de busca mal formados'
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
//                     error: 'Nenhum token fornecido'
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
//                     Ademir.findOne({_id: decoded.id}, function (err, ademirFound) {
//                         if (err) {
//                             return exits.internalError({
//                                 level: 'ERROR',
//                                 message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                 error: err
//                             });
//                         } else if (ademirFound) {
//                             Ademir.findById(inputs.ademir_id, function (err, ademirToBeDeleted) {
//                                 if (err) {
//                                     return exits.internalError({
//                                         level: 'ERROR',
//                                         message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                         error: err
//                                     });
//                                 } else if (ademirToBeDeleted) {
//                                     if (ademirToBeDeleted.manager.toString() === decoded.id.toString()) {
//                                         Ademir.updateMany({manager: inputs.ademir_id}, {$set: {manager: decoded.id}}, function (err, updated) {
//                                             if (err) {
//                                                 return exits.internalError({
//                                                     level: 'ERROR',
//                                                     message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                                     error: err
//                                                 });
//                                             } else if (updated) {
//                                                 Ademir.deleteOne({_id: ademirToBeDeleted._id}, function (err, deletedAdemir) {
//                                                     if (err) {
//                                                         return exits.internalError({
//                                                             level: 'ERROR',
//                                                             message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                                             error: err
//                                                         });
//                                                     } else if (deletedAdemir) {
//                                                         return exits.deleted({
//                                                             level: 'INFO',
//                                                             message: 'Ademir deletado com sucesso!'
//                                                         });
//                                                     } else {
//                                                         return exits.internalError({
//                                                             level: 'ERROR',
//                                                             message: 'Não foi possivel deletar o ademir'
//                                                         });
//                                                     }
//                                                 })
//                                             } else {
//                                                 return exits.internalError({
//                                                     level: 'ERROR',
//                                                     message: 'Não foi possivel trasnferir os subordinados'
//                                                 });
//                                             }
//                                         });
//                                     } else {
//                                         return exits.forbidden({
//                                             level: 'ERROR',
//                                             message: 'Não podes deletar este ademir_id',
//                                             error: 'Invalid ademir_id'
//                                         });
//                                     }
//                                 } else {
//                                     return exits.notFound({
//                                         level: 'ERROR',
//                                         message: 'Nenhum ademir encontrado com o token fornecido, contate um adminstrador do sistema e informe'
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
//         } catch (err) {
//             return exits.internalError({
//                 level: 'ERROR',
//                 message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                 error: err
//             });
//         }
//     }
// };
