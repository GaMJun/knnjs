module.exports = {
    friendlyName: 'Create a Ademir',
    description: 'Adiciona um ademir ao banco de dados do serviço',
    extendedDescription: 'Dada as informações passadas por parametros adiciona um ademir ao banco',
    moreInfoUrl: 'https://documenter.getpostman.com/view/6350371/RznFqJcf#e272c8da-a60c-49f4-afaf-22c4cc796415',
    sideEffects: 'cacheable',
    sync: true,
    inputs: {
        k: {
            type: 'number',
            required: true
        }
        // file: {
        //     type: 'ref',
        //     required: true
        // },
        // file_path: {
        //     type: 'string',
        //     required: false,
        // },
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
        try {

            const fs = require("fs");
            const csv = require("fast-csv");
            const LinkedList = require('dbly-linked-list');

            // let dataSetList = new LinkedList();
            // let dataSetArray_C1 = []; // All objects of type class 1
            // let dataSetArray_C2 = []; // All objects of type class 2
            let trainingArray = []; // 50% of dataSet
            let testArray = [] // 25% of dataSet


            csv.fromPath('uploads/training.csv', {headers: true}).on("data", function (data) {
                trainingArray.push(data);
            })
                .on("end", function () {
                    //console.log("done");
                    // console.log(dataSetList.getSize())
                    csv.fromPath('uploads/test.csv', {headers: true}).on("data", function (data) {
                        testArray.push(data)
                        //console.log(data);
                    })
                        .on("end", function () {
                            let k = inputs.k;

                            let majorityVotes = []; // Vetor para os votos majoritários
                            let majorityAcertCounter = 0; // counter de acertos dos votos majoritarios
                            let majorityErrosCounter = 0; // counter de erros dos votos majoritarios
                            let weightedVotes = []; // Vetor para os votos ponderados
                            let weightedAcertCounter = 0; // counter de acertos dos votos ponderados
                            let weightedErrosCounter = 0; // counter de errps dos votos ponderados

                            let MajorityAcerts = [];
                            let MajorityErros = [];

                            let WeightedAcerts = [];
                            let WeightedErros = [];

                            let mediaAcertoMajoritarioTotal = 0;
                            let mediaErroMajoritarioTotal = 0;
                            let mediaAcertoPonderadoTotal = 0;
                            let mediaErroPonderadoTotal = 0;

                            for (let m=0; m < 10; m++){

                                let mediaAcertoMajoritario = 0;
                                let mediaErroMajoritario = 0;
                                let mediaAcertoPonderado = 0;
                                let mediaErroPonderado = 0;

                                majorityAcertCounter = 0;
                                majorityErrosCounter = 0;
                                weightedAcertCounter = 0;
                                weightedErrosCounter = 0;

                                // para cada item do vetor de validaçao
                                for (let i = 0; i < testArray.length; i++) {
                                    // percorre-se todos os elementos do vetor de treino
                                    for (let j = 0; j < trainingArray.length; j++) {
                                        majorityVotes[j] = Math.sqrt(
                                            Math.pow((testArray[i].A1 - trainingArray[j].A1), 2) +
                                            Math.pow((testArray[i].A2 - trainingArray[j].A2), 2) +
                                            Math.pow((testArray[i].A3 - trainingArray[j].A3), 2) +
                                            Math.pow((testArray[i].A4 - trainingArray[j].A4), 2) +
                                            Math.pow((testArray[i].A5 - trainingArray[j].A5), 2) +
                                            Math.pow((testArray[i].A6 - trainingArray[j].A6), 2) +
                                            Math.pow((testArray[i].A7 - trainingArray[j].A7), 2) +
                                            Math.pow((testArray[i].A8 - trainingArray[j].A8), 2) +
                                            Math.pow((testArray[i].A9 - trainingArray[j].A9), 2) +
                                            Math.pow((testArray[i].A10 - trainingArray[j].A10), 2) +
                                            Math.pow((testArray[i].A11 - trainingArray[j].A11), 2) +
                                            Math.pow((testArray[i].A12 - trainingArray[j].A12), 2) +
                                            Math.pow((testArray[i].A13 - trainingArray[j].A13), 2) +
                                            Math.pow((testArray[i].A14 - trainingArray[j].A14), 2)
                                        );

                                        // Calculo do peso ponderado
                                        weightedVotes[j] = (1 / majorityVotes[j]);
                                    }

                                    // vetor dos menores valores das distancias euclidianas para cada tupla do vetor de validaçao
                                    let minors = [];
                                    // vetor para armazenar os index dos valores do vetor acima
                                    let minorsIndex = [];

                                    // vetor dos maiores elementos dos pesos normalizados
                                    let biggers = [];
                                    let biggersIndex = [];

                                    // inicializaçao/reset dos vetores
                                    for (let i = 0; i < k; i++) {
                                        minors[i] = 1000000;
                                        minorsIndex[i] = 0;

                                        biggers[i] = 0;
                                        biggersIndex[i] = 0;
                                    }

                                    // VOTOS MAJORITARIOS
                                    majorityVotes.forEach(function (vote, index) {
                                        // se o voto for menor que o valor armazenado na primeira posiçao do vetor minors faz-se
                                        // um shift nos elementos e insere o voto na posicao 0
                                        if (vote < minors[0]) {

                                            for (let j = minors.length - 1; j > 0; j--) {
                                                minors[j] = minors[j - 1];
                                                minorsIndex[j] = minorsIndex[j - 1];
                                            }
                                            minors[0] = vote;
                                            minorsIndex[0] = index;
                                        }
                                    });


                                    // contadores de votos para cada classe
                                    let class1 = 0;
                                    let class2 = 0;

                                    minorsIndex.forEach(function (position) {
                                        let object = trainingArray[position];
                                        if (object.Class === '1') {
                                            class1++;
                                        } else {
                                            class2++;
                                        }
                                    });

                                    // Validaçao dos votos majoritarios
                                    if (class1 > class2) {
                                        if (testArray[i].Class === '1') {
                                            majorityAcertCounter++;
                                        } else {
                                            majorityErrosCounter++;
                                        }
                                    } else if (class1 < class2) {
                                        if (testArray[i].Class === '2') {
                                            majorityAcertCounter++;
                                        } else {
                                            majorityErrosCounter++;
                                        }
                                    }


                                    // VOTOS PONDERADOS
                                    weightedVotes.forEach(function (vote, index) {
                                        if (vote > biggers[0]) {
                                            for (let j = biggers.length - 1; j > 0; j--) {
                                                biggers[j] = biggers[j - 1];
                                                biggersIndex[j] = biggersIndex[j - 1];
                                            }
                                            biggers[0] = vote;
                                            biggersIndex[0] = index;
                                        }
                                    });

                                    // reset das variaveis responsaveis por contar os votos para cada classe
                                    class1 = 0;
                                    class2 = 0;

                                    biggersIndex.forEach(function (position) {
                                        let object = trainingArray[position];
                                        if (object.Class === '1') {
                                            class1 = class1 + weightedVotes[position];
                                        } else {
                                            class2 = class2 + weightedVotes[position];
                                        }
                                    });

                                    // Validaçao dos votos
                                    if (class1 > class2) {
                                        if (testArray[i].Class === '1') {
                                            weightedAcertCounter++;
                                        } else {
                                            weightedErrosCounter++;
                                        }
                                    } else if (class1 < class2) {
                                        if (testArray[i].Class === '2') {
                                            weightedAcertCounter++;
                                        } else {
                                            weightedErrosCounter++;
                                        }
                                    }
                                }

                                mediaAcertoMajoritario = ((majorityAcertCounter * 100) / (majorityAcertCounter + majorityErrosCounter));
                                mediaErroMajoritario = ((majorityErrosCounter * 100) / (majorityAcertCounter + majorityErrosCounter));

                                MajorityAcerts[m] = mediaAcertoMajoritario;
                                MajorityErros[m] = mediaErroMajoritario;

                                mediaAcertoPonderado = ((weightedAcertCounter * 100) / (weightedAcertCounter + weightedErrosCounter));
                                mediaErroPonderado = ((weightedErrosCounter * 100) / (weightedAcertCounter + weightedErrosCounter));

                                WeightedAcerts[m] = mediaAcertoPonderado;
                                WeightedErros[m] = mediaErroPonderado;

                                mediaAcertoMajoritarioTotal = mediaAcertoMajoritarioTotal + mediaAcertoMajoritario;
                                mediaErroMajoritarioTotal = mediaErroMajoritarioTotal + mediaErroMajoritario;

                                mediaAcertoPonderadoTotal = mediaAcertoPonderadoTotal + mediaAcertoPonderado;
                                mediaErroPonderadoTotal = mediaErroPonderadoTotal + mediaErroPonderado;
                            }

                            // Calculo das medias
                            mediaAcertoMajoritarioTotal = (mediaAcertoMajoritarioTotal/10);
                            mediaErroMajoritarioTotal = mediaErroMajoritarioTotal/10;

                            mediaAcertoPonderadoTotal = mediaAcertoPonderadoTotal/10;
                            mediaErroPonderadoTotal = mediaErroPonderadoTotal/10;



                            //Calculo do Desvio Padrao
                            let desvioPadraoMajoritarioAcertos = 0;
                            let desvioPadraoMajoritarioErros = 0;
                            let desvioPadraoPonderadoAcertos = 0;
                            let desvioPadraoPonderadoErros = 0;


                            for (let m=0; m<MajorityAcerts.length; m++){
                                desvioPadraoMajoritarioAcertos = desvioPadraoMajoritarioAcertos + (Math.pow((MajorityAcerts[m] - mediaAcertoMajoritarioTotal), 2));
                            }

                            for (let m=0; m<MajorityErros.length; m++){
                                desvioPadraoMajoritarioErros = desvioPadraoMajoritarioErros + (Math.pow((MajorityErros[m] - mediaErroMajoritarioTotal), 2));
                            }

                            for (let m=0; m<WeightedAcerts.length; m++){
                                desvioPadraoPonderadoAcertos = desvioPadraoPonderadoAcertos + (Math.pow((WeightedAcerts[m] - mediaAcertoPonderadoTotal), 2));
                            }

                            for (let m=0; m<WeightedErros.length; m++){
                                desvioPadraoPonderadoErros = desvioPadraoPonderadoErros + (Math.pow((WeightedErros[m] - mediaErroPonderadoTotal), 2));
                            }

                            desvioPadraoMajoritarioAcertos = Math.sqrt(desvioPadraoMajoritarioAcertos);
                            desvioPadraoMajoritarioErros = Math.sqrt(desvioPadraoMajoritarioErros);
                            desvioPadraoPonderadoAcertos = Math.sqrt(desvioPadraoPonderadoAcertos);
                            desvioPadraoPonderadoErros = Math.sqrt(desvioPadraoPonderadoErros);


                            let storeMajorityAcerts = {
                              firstIteration: 0,
                              secondIteration: 0,
                              thirdIteration: 0,
                              fouthIteration: 0,
                              fifthIteration: 0,
                              sixthIteration: 0,
                              seventhIteration: 0,
                              eighthIteration: 0,
                              ninethIteration: 0,
                              tenthIteration: 0,
                              media: 0,
                              desvPadrao: 0,

                            };

                            let storeMajorityErros = {
                              firstIteration: 0,
                              secondIteration: 0,
                              thirdIteration: 0,
                              fouthIteration: 0,
                              fifthIteration: 0,
                              sixthIteration: 0,
                              seventhIteration: 0,
                              eighthIteration: 0,
                              ninethIteration: 0,
                              tenthIteration: 0,
                              media: 0,
                              desvPadrao: 0,

                            };

                            let storeWeightedAcerts = {
                              firstIteration: 0,
                              secondIteration: 0,
                              thirdIteration: 0,
                              fouthIteration: 0,
                              fifthIteration: 0,
                              sixthIteration: 0,
                              seventhIteration: 0,
                              eighthIteration: 0,
                              ninethIteration: 0,
                              tenthIteration: 0,
                              media: 0,
                              desvPadrao: 0,

                            };

                            let storeWeightedErros = {
                              firstIteration: 0,
                              secondIteration: 0,
                              thirdIteration: 0,
                              fouthIteration: 0,
                              fifthIteration: 0,
                              sixthIteration: 0,
                              seventhIteration: 0,
                              eighthIteration: 0,
                              ninethIteration: 0,
                              tenthIteration: 0,
                              media: 0,
                              desvPadrao: 0,

                            };

                            let resultsArray = [];

                            storeMajorityAcerts.firstIteration = MajorityAcerts[0];
                            storeMajorityAcerts.secondIteration = MajorityAcerts[1];
                            storeMajorityAcerts.thirdIteration = MajorityAcerts[2];
                            storeMajorityAcerts.fouthIteration = MajorityAcerts[3];
                            storeMajorityAcerts.fifthIteration = MajorityAcerts[4];
                            storeMajorityAcerts.sixthIteration = MajorityAcerts[5];
                            storeMajorityAcerts.seventhIteration = MajorityAcerts[6];
                            storeMajorityAcerts.eighthIteration = MajorityAcerts[7];
                            storeMajorityAcerts.ninethIteration = MajorityAcerts[8];
                            storeMajorityAcerts.tenthIteration = MajorityAcerts[9];
                            storeMajorityAcerts.media = mediaAcertoMajoritarioTotal;
                            storeMajorityAcerts.desvPadrao = desvioPadraoMajoritarioAcertos;

                            resultsArray.push(storeMajorityAcerts);


                            storeMajorityErros.firstIteration = MajorityErros[0];
                            storeMajorityErros.secondIteration = MajorityErros[1];
                            storeMajorityErros.thirdIteration = MajorityErros[2];
                            storeMajorityErros.fouthIteration = MajorityErros[3];
                            storeMajorityErros.fifthIteration = MajorityErros[4];
                            storeMajorityErros.sixthIteration = MajorityErros[5];
                            storeMajorityErros.seventhIteration = MajorityErros[6];
                            storeMajorityErros.eighthIteration = MajorityErros[7];
                            storeMajorityErros.ninethIteration = MajorityErros[8];
                            storeMajorityErros.tenthIteration = MajorityErros[9];
                            storeMajorityErros.media = mediaErroMajoritarioTotal;
                            storeMajorityErros.desvPadrao = desvioPadraoMajoritarioErros;

                            resultsArray.push(storeMajorityErros);

                            storeWeightedAcerts.firstIteration = WeightedAcerts[0];
                            storeWeightedAcerts.secondIteration = WeightedAcerts[1];
                            storeWeightedAcerts.thirdIteration = WeightedAcerts[2];
                            storeWeightedAcerts.fouthIteration = WeightedAcerts[3];
                            storeWeightedAcerts.fifthIteration = WeightedAcerts[4];
                            storeWeightedAcerts.sixthIteration = WeightedAcerts[5];
                            storeWeightedAcerts.seventhIteration = WeightedAcerts[6];
                            storeWeightedAcerts.eighthIteration = WeightedAcerts[7];
                            storeWeightedAcerts.ninethIteration = WeightedAcerts[8];
                            storeWeightedAcerts.tenthIteration = WeightedAcerts[9];
                            storeWeightedAcerts.media = mediaAcertoPonderadoTotal;
                            storeWeightedAcerts.desvPadrao = desvioPadraoPonderadoAcertos;

                            resultsArray.push(storeWeightedAcerts);

                            storeWeightedErros.firstIteration = WeightedErros[0];
                            storeWeightedErros.secondIteration = WeightedErros[1];
                            storeWeightedErros.thirdIteration = WeightedErros[2];
                            storeWeightedErros.fouthIteration = WeightedErros[3];
                            storeWeightedErros.fifthIteration = WeightedErros[4];
                            storeWeightedErros.sixthIteration = WeightedErros[5];
                            storeWeightedErros.seventhIteration = WeightedErros[6];
                            storeWeightedErros.eighthIteration = WeightedErros[7];
                            storeWeightedErros.ninethIteration = WeightedErros[8];
                            storeWeightedErros.tenthIteration = WeightedErros[9];
                            storeWeightedErros.media = mediaErroPonderadoTotal;
                            storeWeightedErros.desvPadrao = desvioPadraoPonderadoErros;

                            resultsArray.push(storeWeightedErros);

                            // resultsArray = MajorityAcerts.concat(mediaAcertoMajoritarioTotal);
                            // resultsArray = resultsArray.concat(desvioPadraoMajoritarioAcertos);
                            // // resultsArray = resultsArray.concat('\n');
                            //
                            // resultsArray = resultsArray.concat(MajorityErros);
                            // resultsArray = resultsArray.concat(mediaErroMajoritarioTotal);
                            // resultsArray = resultsArray.concat(desvioPadraoMajoritarioErros);
                            // // resultsArray = resultsArray.concat('\n');
                            //
                            // resultsArray = resultsArray.concat(WeightedAcerts);
                            // resultsArray = resultsArray.concat(mediaAcertoPonderadoTotal);
                            // resultsArray = resultsArray.concat(desvioPadraoPonderadoAcertos);
                            // // resultsArray = resultsArray.concat('\n');
                            //
                            // resultsArray = resultsArray.concat(WeightedErros);
                            // resultsArray = resultsArray.concat(mediaErroPonderadoTotal);
                            // resultsArray = resultsArray.concat(desvioPadraoPonderadoErros);
                            // // resultsArray = resultsArray.concat('\n');


                            // for (let j=0; j < resultsArray.length; j++){
                            //     console.log(resultsArray[j]);
                            // }



                            let resultsCSV = fs.createWriteStream('uploads/results.csv');

                            csv.write(resultsArray, {headers:true})
                                .pipe(resultsCSV);
                        });
                });

            return exits.created({
                level: 'ERROR',
                message: 'FOI',
                //return the best k
                path: inputs.file_path
            });


        } catch
            (err) {
            return exits.internalError({
                level: 'ERROR',
                message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
                error: err
            });
        }
    }
};
