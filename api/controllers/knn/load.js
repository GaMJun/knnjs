let a = 0;

module.exports = {
    friendlyName: 'Create a Ademir',
    description: 'Adiciona um ademir ao banco de dados do serviço',
    extendedDescription: 'Dada as informações passadas por parametros adiciona um ademir ao banco',
    moreInfoUrl: 'https://documenter.getpostman.com/view/6350371/RznFqJcf#e272c8da-a60c-49f4-afaf-22c4cc796415',
    sideEffects: 'cacheable',
    sync: true,
    inputs: {
        // file: {
        //     type: 'ref',
        //     required: true
        // },
        file_path: {
            type: 'string',
            required: false,
        },
        // password: {
        //     type: 'string',
        //     trim: true,
        //     required: true,
        //     description: 'Senha do ademir'
        // },
        // permission: {
        //     type: 'number',
        //     trim: true,
        //     required: true,
        //     description: 'Nível de permissão do ademir'
        // },
        // app: {
        //     friendlyName: 'model',
        //     type: 'ref',
        //     description: 'Aplicação em questão',
        //     extendedDescription: 'Esta variável é adicionada pelo roteador e não é necessário passa-la na requisição, ' +
        //         'isto se faz necessário para ter acesso aos modelos do banco',
        //     required: true
        // }
    },
    exits: {
        created: {
            statusCode: 201,
            outputExample: {level: 'INFO', message: 'Ademir criado com sucesso!'},
            outputFriendlyName: 'Adicionado com sucesso',
            outputDescription: 'Retorna uma mensagem de sucesso',
        },
        badRequest: {
            statusCode: 400,
            description: 'Requisição mal formada',
            outputExample: {
                level: 'ERROR',
                message: 'Requisição mal formada',
                error: 'Parâmetros de login mal formados'
            }
        },
        unauthorized: {
            statusCode: 401,
            description: 'Token expirado',
            outputExample: {level: 'ERROR', message: 'Não autorizado', error: 'Token expirado'}
        },
        forbidden: {
            statusCode: 403,
            description: 'Ação proibida',
            outputExample: {level: 'ERROR', message: 'Não autorizado', error: 'Esta conta pode acessar isso'}
        },
        ademirExists: {
            statusCode: 406,
            outputExample: {level: 'ERROR', message: 'Ademir já cadastrado'},
            outputFriendlyName: 'Ademir já existe',
            outputDescription: 'Caso o Ademir já exista na base de dados, retorna um erro informando',
        },
        internalError: {
            statusCode: 500,
            description: 'Erro imprevisto, contate um adminstrador do sistema',
            outputExample: {
                level: 'ERROR',
                message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
                error: 'err DO CATCH AQUI'
            }
        }
    },

    fn: function (inputs, exits) {

        // Funçao para dar shuffle nos vetores
        function shuffle(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        try {

            const fs = require("fs");
            const csv = require("fast-csv");
            const LinkedList = require('dbly-linked-list');

            let dataSetList = new LinkedList();
            let dataSetArray_C1 = []; // All objects of type class 1
            let dataSetArray_C2 = []; // All objects of type class 2
            let trainingArray = []; // 50% of dataSet
            let validationArray = []; // 25% of dataSet
            let testArray = []; // 25% of dataSet



            csv.fromPath(inputs.file_path, {headers: true}).on("data", function (data) {
                dataSetList.insert(data);
                //console.log(data);
            })
                .on("end", function () {
                    //console.log("done");
                    // console.log(dataSetList.getSize())

                    let empty = dataSetList.isEmpty();

                    while (!empty) {
                        let object = dataSetList.getHeadNode().getData();

                        if (object.Class === '1') {
                            dataSetArray_C1.push(object);
                            dataSetList.removeFirst()
                        } else if (object.Class === '2') {
                            dataSetArray_C2.push(object);
                            dataSetList.removeFirst()
                        }
                        empty = dataSetList.isEmpty();
                    }

                    let testPorcentation_C1 = Math.round((25 * dataSetArray_C1.length) / 100);
                    let testPorcentation_C2 = Math.round((25 * dataSetArray_C2.length) / 100);
                    let validationPorcentation_C1 = Math.round((25 * dataSetArray_C1.length) / 100);
                    let validationPorcentation_C2 = Math.round((25 * dataSetArray_C2.length) / 100);
                    let randonPosition = 0;


                    while (testPorcentation_C1 > 0) {
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C1.length))
                        testArray.push(dataSetArray_C1[randonPosition]);
                        dataSetArray_C1.splice(randonPosition, 1);
                        testPorcentation_C1--;
                    }
                    while (testPorcentation_C2 > 0) {
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C2.length))
                        testArray.push(dataSetArray_C2[randonPosition]);
                        dataSetArray_C2.splice(randonPosition, 1);
                        testPorcentation_C2--;
                    }

                    while (validationPorcentation_C1 > 0) {
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C1.length))
                        validationArray.push(dataSetArray_C1[randonPosition]);
                        dataSetArray_C1.splice(randonPosition, 1);
                        validationPorcentation_C1--;
                    }
                    while (validationPorcentation_C2 > 0) {
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C2.length))
                        validationArray.push(dataSetArray_C2[randonPosition]);
                        dataSetArray_C2.splice(randonPosition, 1);
                        validationPorcentation_C2--;
                    }

                    trainingArray = dataSetArray_C1.concat(dataSetArray_C2);

                    shuffle(testArray);
                    shuffle(validationArray);
                    shuffle(trainingArray);



                    let trainingcsv = fs.createWriteStream('uploads/training.csv');
                    let validationcsv = fs.createWriteStream('uploads/validation.csv');
                    let testcsv = fs.createWriteStream('uploads/test.csv');

                    csv.write(trainingArray, {headers:true})
                        .pipe(trainingcsv);
                    csv.write(validationArray, {headers:true})
                        .pipe(validationcsv);
                    csv.write(testArray, {headers:true})
                        .pipe(testcsv);

                    // Algorithm starts here

                    // // let k = 3;
                    // let majorityVotes = []; // Vetor para os votos majoritários
                    // let majorityAcertCounter = 0; // counter de acertos dos votos majoritarios
                    // let majorityErrosCounter = 0; // counter de erros dos votos majoritarios
                    // let weightedVotes = []; // Vetor para os votos ponderados
                    // let weightedAcertCounter = 0; // counter de acertos dos votos ponderados
                    // let weightedErrosCounter = 0; // counter de errps dos votos ponderados
                    //
                    //
                    // for (let k = 1; k <= 15; k = k + 2) {
                    //     let mediaMajoritario = 0;
                    //     let mediaPonderado = 0;
                    //
                    //     for (let l = 0; l < 5; l++) {
                    //
                    //         majorityAcertCounter = 0;
                    //         majorityErrosCounter = 0;
                    //         weightedAcertCounter = 0;
                    //         weightedErrosCounter = 0;
                    //
                    //         // para cada item do vetor de validaçao
                    //         for (let i = 0; i < validationArray.length; i++) {
                    //             // percorre-se todos os elementos do vetor de treino
                    //             for (let j = 0; j < trainingArray.length; j++) {
                    //                 // calculando a distancia euclidiana entre o item no vetor de validaçao e cada
                    //                 // item do vetor de treino, armazenando no vetor majorityVotes (votos majotitarios)
                    //                 majorityVotes[j] = Math.sqrt(
                    //                     Math.pow((validationArray[i].A1 - trainingArray[j].A1), 2) +
                    //                     Math.pow((validationArray[i].A2 - trainingArray[j].A2), 2) +
                    //                     Math.pow((validationArray[i].A3 - trainingArray[j].A3), 2) +
                    //                     Math.pow((validationArray[i].A4 - trainingArray[j].A4), 2) +
                    //                     Math.pow((validationArray[i].A5 - trainingArray[j].A5), 2) +
                    //                     Math.pow((validationArray[i].A6 - trainingArray[j].A6), 2) +
                    //                     Math.pow((validationArray[i].A7 - trainingArray[j].A7), 2) +
                    //                     Math.pow((validationArray[i].A8 - trainingArray[j].A8), 2) +
                    //                     Math.pow((validationArray[i].A9 - trainingArray[j].A9), 2) +
                    //                     Math.pow((validationArray[i].A10 - trainingArray[j].A10), 2) +
                    //                     Math.pow((validationArray[i].A11 - trainingArray[j].A11), 2) +
                    //                     Math.pow((validationArray[i].A12 - trainingArray[j].A12), 2) +
                    //                     Math.pow((validationArray[i].A13 - trainingArray[j].A13), 2) +
                    //                     Math.pow((validationArray[i].A14 - trainingArray[j].A14), 2)
                    //                 );
                    //
                    //                 // Calculo do peso ponderado
                    //                 weightedVotes[j] = (1 / majorityVotes[j]);
                    //             }
                    //
                    //             // vetor dos menores valores das distancias euclidianas para cada tupla do vetor de validaçao
                    //             let minors = [];
                    //             // vetor para armazenar os index dos valores do vetor acima
                    //             let minorsIndex = [];
                    //
                    //             // vetor dos maiores elementos dos pesos normalizados
                    //             let biggers = [];
                    //             let biggersIndex = [];
                    //
                    //             // inicializaçao/reset dos vetores
                    //             for (let i = 0; i < k; i++) {
                    //                 minors[i] = 1000000;
                    //                 minorsIndex[i] = 0;
                    //
                    //                 biggers[i] = 0;
                    //                 biggersIndex[i] = 0;
                    //             }
                    //
                    //             // VOTOS MAJORITARIOS
                    //             majorityVotes.forEach(function (vote, index) {
                    //                 // se o voto for menor que o valor armazenado na primeira posiçao do vetor minors faz-se
                    //                 // um shift nos elementos e insere o voto na posicao 0
                    //                 if (vote < minors[0]) {
                    //
                    //                     for (let j = minors.length - 1; j > 0; j--) {
                    //                         minors[j] = minors[j - 1];
                    //                         minorsIndex[j] = minorsIndex[j - 1];
                    //                     }
                    //                     minors[0] = vote;
                    //                     minorsIndex[0] = index;
                    //                 }
                    //             });
                    //
                    //
                    //             // contadores de votos para cada classe
                    //             let class1 = 0;
                    //             let class2 = 0;
                    //
                    //             minorsIndex.forEach(function (position) {
                    //                 let object = trainingArray[position];
                    //                 if (object.Class === '1') {
                    //                     class1++;
                    //                 } else {
                    //                     class2++;
                    //                 }
                    //             });
                    //
                    //             // Validaçao dos votos majoritarios
                    //             if (class1 > class2) {
                    //                 if (validationArray[i].Class === '1') {
                    //                     majorityAcertCounter++;
                    //                 } else {
                    //                     majorityErrosCounter++;
                    //                 }
                    //             } else if (class1 < class2) {
                    //                 if (validationArray[i].Class === '2') {
                    //                     majorityAcertCounter++;
                    //                 } else {
                    //                     majorityErrosCounter++;
                    //                 }
                    //             }
                    //
                    //
                    //             // VOTOS PONDERADOS
                    //             weightedVotes.forEach(function (vote, index) {
                    //                 if (vote > biggers[0]) {
                    //                     for (let j = biggers.length - 1; j > 0; j--) {
                    //                         biggers[j] = biggers[j - 1];
                    //                         biggersIndex[j] = biggersIndex[j - 1];
                    //                     }
                    //                     biggers[0] = vote;
                    //                     biggersIndex[0] = index;
                    //                 }
                    //             });
                    //
                    //             // reset das variaveis responsaveis por contar os votos para cada classe
                    //             class1 = 0;
                    //             class2 = 0;
                    //
                    //             biggersIndex.forEach(function (position) {
                    //                 let object = trainingArray[position];
                    //                 if (object.Class === '1') {
                    //                     class1 = class1 + weightedVotes[position];
                    //                 } else {
                    //                     class2 = class2 + weightedVotes[position];
                    //                 }
                    //             });
                    //
                    //             // Validaçao dos votos
                    //             if (class1 > class2) {
                    //                 if (validationArray[i].Class === '1') {
                    //                     weightedAcertCounter++;
                    //                 } else {
                    //                     weightedErrosCounter++;
                    //                 }
                    //             } else if (class1 < class2) {
                    //                 if (validationArray[i].Class === '2') {
                    //                     weightedAcertCounter++;
                    //                 } else {
                    //                     weightedErrosCounter++;
                    //                 }
                    //             }
                    //         }
                    //
                    //         // console.log('K: ' + k)
                    //         // console.log('VOTOS MAJORITARIO:')
                    //         // console.log("Acertos: " + majorityAcertCounter);
                    //         // console.log("Erros: " + majorityErrosCounter);
                    //         // console.log("Porcentagem de acerto: " + ((majorityAcertCounter * 100) / (majorityAcertCounter + majorityErrosCounter)) + "\n");
                    //         // console.log("VOTOS PONDERADOS:")
                    //         // console.log("Acertos: " + weightedAcertCounter);
                    //         // console.log("Erros: " + weightedErrosCounter);
                    //         // console.log("Porcentagem de acerto: " + ((weightedAcertCounter * 100) / (weightedAcertCounter + weightedErrosCounter)) + "\n");
                    //
                    //         mediaMajoritario = mediaMajoritario + ((majorityAcertCounter * 100) / (majorityAcertCounter + majorityErrosCounter));
                    //         mediaPonderado = mediaPonderado + ((weightedAcertCounter * 100) / (weightedAcertCounter + weightedErrosCounter));
                    //     }
                    //
                    //     console.log("MAJORITARIO: Media de acertos com k = " + k)
                    //     console.log(mediaMajoritario / 5)
                    //     console.log("PONDERADO: Media de acertos com k = " + k)
                    //     console.log(mediaPonderado / 5)
                    //     console.log("\n")
                    // }

                });

            console.log(inputs.file_path);

            return true;
            // return exits.created({
            //     level: 'ERROR',
            //     message: 'FOI' + a,
            //     path: inputs.file_path
            // });


        } catch
            (err) {
            // return true;
            return exits.internalError({
                level: 'ERROR',
                message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
                error: err
            });
        }
    }
};
