// const mongoose = require('mongoose');
// const config = require('../../../../config/config');
// const jwt = require('jsonwebtoken');
//
// module.exports = {
//     friendlyName: 'Get subordinates of a ademir',
//     description: 'Obtem uma lista de ademirs surbodinados de um ademir',
//     moreInfoUrl: 'https://documenter.getpostman.com/view/6350371/RznFqJcf#74aa54c2-2c65-4814-a599-e199e901e041',
//     sideEffects: 'cacheable',
//     sync: true,
//     inputs: {
//         headers: {
//             type: 'ref',
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
//         found: {
//             statusCode: 200,
//             outputExample: {level: 'INFO', message: 'Usuário encontrado com sucesso!'},
//             outputFriendlyName: 'Encontrado com sucesso',
//             outputDescription: 'Retorna uma mensagem de sucesso e as informações do usuário',
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
//
//                             Ademir.find({manager: ademirFound._id}, function (err, subordinatesFound) {
//                                 if (err) {
//                                     return exits.internalError({
//                                         level: 'ERROR',
//                                         message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
//                                         error: err
//                                     });
//                                 } else {
//                                     return exits.found({
//                                         level: 'INFO',
//                                         ademir: {
//                                             _id: ademirFound._id,
//                                             login: ademirFound.login,
//                                             permission: ademirFound.permission
//                                         },
//                                         subordinates: subordinatesFound.map(subordinate => {
//                                             return ({
//                                                 _id: subordinate._id,
//                                                 login: subordinate.login,
//                                                 permission: subordinate.permission
//                                             });
//                                         })
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
