const fs = require("fs");
const csv = require("fast-csv");
const LinkedList = require('dbly-linked-list');

// Function to shuffle arrays
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

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
        },
        file_path: {
            type: 'string',
            required: true,
        },
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
            let dataSetList = new LinkedList();
            let dataSetArray = [];
            let dataSetArray_C1 = []; // All objects of type class 1
            let dataSetArray_C2 = []; // All objects of type class 2
            let trainingArray = []; // 50% of dataSet
            let validationArray = []; // 25% of dataSet
            let testArray = [];// 25% of dataSet


            csv.fromPath(inputs.file_path, {headers: true}).on("data", function (data) {
                dataSetList.insert(data);
                dataSetArray.push(data);
            }).on("end", function () {
                csv.fromPath('uploads/training.csv', {headers: true}).on("data", function (data) {
                    trainingArray.push(data);
                }).on("end", function () {
                    csv.fromPath('uploads/test.csv', {headers: true}).on("data", function (data) {
                        testArray.push(data)
                    }).on("end", function () {

                        let k = inputs.k;

                        let majorityVotes = []; // Array of majority votes
                        let majorityHitCounter = 0; // Counter of hits from majority votes
                        let majorityMissCounter = 0; // Counter of miss from majority votes
                        let weightedVotes = []; // Array of weighted votes
                        let weightedHitCounter = 0; // Counter of hits from weighted votes
                        let weightedMissCounter = 0; // Counter of miss from weighted votes

                        let MajorityAcerts = [];
                        let MajorityErros = [];

                        let WeightedAcerts = [];
                        let WeightedErros = [];

                        let mediaAcertoMajoritarioTotal = 0;
                        let mediaErroMajoritarioTotal = 0;
                        let mediaAcertoPonderadoTotal = 0;
                        let mediaErroPonderadoTotal = 0;


                        for (let m = 0; m < 10; m++) {

                            let mediaAcertoMajoritario = 0;
                            let mediaErroMajoritario = 0;
                            let mediaAcertoPonderado = 0;
                            let mediaErroPonderado = 0;

                            majorityHitCounter = 0;
                            majorityMissCounter = 0;
                            weightedHitCounter = 0;
                            weightedMissCounter = 0;

                            // For each validationArray instance
                            for (let i = 0; i < testArray.length; i++) {
                                // Run every trainingArray instances
                                for (let j = 0; j < trainingArray.length; j++) {

                                    // Calculating the Euclidean distance between the item in the validation vector and each item in the training vector
                                    // Storing in majorityVotes array
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

                                    // Calculation of the inverse of the Euclidean distance
                                    weightedVotes[j] = (1 / majorityVotes[j]);
                                }

                                // Vector of the lowest values of the Euclidean distances for each tuple of the validation vector
                                let minors = [];
                                // Vector to store the index of the above vector values
                                let minorsIndex = [];

                                // Vector of the largest elements of the normalized weights
                                let biggers = [];
                                let biggersIndex = [];

                                // Initialization / reset of arrays
                                for (let i = 0; i < k; i++) {
                                    minors[i] = 1000000;
                                    minorsIndex[i] = 0;

                                    biggers[i] = 0;
                                    biggersIndex[i] = 0;
                                }

                                //Majoritary Votes

                                // Finding the k minors values
                                for (let i = 0; i < k; i++) {
                                    for (let j = 0; j < majorityVotes.length; j++) {
                                        if (minors[i] > majorityVotes[j]) {
                                            minors[i] = majorityVotes[j];
                                            minorsIndex[i] = j;
                                        }
                                    }
                                    majorityVotes[minorsIndex[i]] = Infinity;
                                }

                                // Vote counter for the classes
                                let class1 = 0;
                                let class2 = 0;

                                minorsIndex.forEach(function (position) {
                                    trainingArray[position].Class === '1' ? class1++ : class2++;
                                });

                                // Validating the majoritary votes
                                if (class1 > class2) {
                                    testArray[i].Class === '1' ? majorityHitCounter++ : majorityMissCounter++;
                                } else if (class1 < class2) {
                                    testArray[i].Class === '2' ? majorityHitCounter++ : majorityMissCounter++;
                                }


                                // Finding the k biggers values
                                for (let i = 0; i < k; i++) {
                                    for (let j = 0; j < weightedVotes.length; j++) {
                                        if (biggers[i] < weightedVotes[j]) {
                                            biggers[i] = weightedVotes[j];
                                            biggersIndex[i] = j;
                                        }
                                    }
                                    weightedVotes[biggersIndex[i]] = 0;
                                }

                                // Vote counter for the classes reset
                                class1 = 0;
                                class2 = 0;

                                biggersIndex.forEach(function (position, index) {
                                    trainingArray[position].Class === '1' ? class1 = class1 + biggers[index] : class2 = class2 + biggers[index];
                                });

                                // Validating the weighted votes
                                if (class1 > class2) {
                                    testArray[i].Class === '1' ? weightedHitCounter++ : weightedMissCounter++;
                                } else if (class1 < class2) {
                                    testArray[i].Class === '2' ? weightedHitCounter++ : weightedMissCounter++;
                                }
                            }

                            mediaAcertoMajoritario = ((majorityHitCounter * 100) / (majorityHitCounter + majorityMissCounter));
                            mediaErroMajoritario = ((majorityMissCounter * 100) / (majorityHitCounter + majorityMissCounter));

                            MajorityAcerts[m] = mediaAcertoMajoritario;
                            MajorityErros[m] = mediaErroMajoritario;

                            mediaAcertoPonderado = ((weightedHitCounter * 100) / (weightedHitCounter + weightedMissCounter));
                            mediaErroPonderado = ((weightedMissCounter * 100) / (weightedHitCounter + weightedMissCounter));

                            WeightedAcerts[m] = mediaAcertoPonderado;
                            WeightedErros[m] = mediaErroPonderado;

                            mediaAcertoMajoritarioTotal = mediaAcertoMajoritarioTotal + mediaAcertoMajoritario;
                            mediaErroMajoritarioTotal = mediaErroMajoritarioTotal + mediaErroMajoritario;

                            mediaAcertoPonderadoTotal = mediaAcertoPonderadoTotal + mediaAcertoPonderado;
                            mediaErroPonderadoTotal = mediaErroPonderadoTotal + mediaErroPonderado;


                            //Change files

                            dataSetList = new LinkedList();
                            dataSetArray_C1 = []; // All objects of type class 1
                            dataSetArray_C2 = []; // All objects of type class 2
                            trainingArray = []; // 50% of dataSet
                            validationArray = []; // 25% of dataSet
                            testArray = [];// 25% of dataSet

                            dataSetArray.forEach(function (data) {
                                dataSetList.insert(data);
                            });

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

                            let sizeByPercentTestC1 = Math.round((25 * dataSetArray_C1.length) / 100);
                            let sizeByPercentTestC2 = Math.round((25 * dataSetArray_C2.length) / 100);
                            let sizeByPercentValidationC1 = Math.round((25 * dataSetArray_C1.length) / 100);
                            let sizeByPercentValidationC2 = Math.round((25 * dataSetArray_C2.length) / 100);
                            let randomIndex = 0;


                            while (sizeByPercentTestC1 > 0) {
                                randomIndex = Math.floor(Math.random() * (dataSetArray_C1.length))
                                testArray.push(dataSetArray_C1[randomIndex]);
                                dataSetArray_C1.splice(randomIndex, 1);
                                sizeByPercentTestC1--;
                            }
                            while (sizeByPercentTestC2 > 0) {
                                randomIndex = Math.floor(Math.random() * (dataSetArray_C2.length))
                                testArray.push(dataSetArray_C2[randomIndex]);
                                dataSetArray_C2.splice(randomIndex, 1);
                                sizeByPercentTestC2--;
                            }

                            while (sizeByPercentValidationC1 > 0) {
                                randomIndex = Math.floor(Math.random() * (dataSetArray_C1.length))
                                validationArray.push(dataSetArray_C1[randomIndex]);
                                dataSetArray_C1.splice(randomIndex, 1);
                                sizeByPercentValidationC1--;
                            }
                            while (sizeByPercentValidationC2 > 0) {
                                randomIndex = Math.floor(Math.random() * (dataSetArray_C2.length))
                                validationArray.push(dataSetArray_C2[randomIndex]);
                                dataSetArray_C2.splice(randomIndex, 1);
                                sizeByPercentValidationC2--;
                            }

                            trainingArray = dataSetArray_C1.concat(dataSetArray_C2);

                            shuffle(testArray);
                            shuffle(validationArray);
                            shuffle(trainingArray);

                            // Removing older files
                            fs.unlinkSync('uploads/Adult - Gilberto e Henrique.csv');
                            fs.unlinkSync('uploads/training.csv');
                            fs.unlinkSync('uploads/validation.csv');
                            fs.unlinkSync('uploads/test.csv');

                            // Writing new files
                            let dataSetcsv = fs.createWriteStream('uploads/Adult - Gilberto e Henrique.csv');
                            let trainingCSV = fs.createWriteStream('uploads/training.csv');
                            let validationCSV = fs.createWriteStream('uploads/validation.csv');
                            let testCSV = fs.createWriteStream('uploads/test.csv');

                            csv.write(dataSetArray, {headers: true})
                                .pipe(dataSetcsv);
                            csv.write(trainingArray, {headers: true})
                                .pipe(trainingCSV);
                            csv.write(validationArray, {headers: true})
                                .pipe(validationCSV);
                            csv.write(testArray, {headers: true})
                                .pipe(testCSV);

                            dataSetArray.forEach(function (data) {
                                dataSetList.insert(data);
                            });

                        }

                        //Averages calculation
                        mediaAcertoMajoritarioTotal = (mediaAcertoMajoritarioTotal / 10);
                        mediaErroMajoritarioTotal = mediaErroMajoritarioTotal / 10;

                        mediaAcertoPonderadoTotal = mediaAcertoPonderadoTotal / 10;
                        mediaErroPonderadoTotal = mediaErroPonderadoTotal / 10;


                        //Standard Deviation Calculation (DP)
                        let desvioPadraoMajoritarioAcertos = 0;
                        let desvioPadraoMajoritarioErros = 0;
                        let desvioPadraoPonderadoAcertos = 0;
                        let desvioPadraoPonderadoErros = 0;

                        for (let m = 0; m < 10; m++) {
                            desvioPadraoMajoritarioAcertos = desvioPadraoMajoritarioAcertos + (Math.pow((MajorityAcerts[m] - mediaAcertoMajoritarioTotal), 2));
                            desvioPadraoMajoritarioErros = desvioPadraoMajoritarioErros + (Math.pow((MajorityErros[m] - mediaErroMajoritarioTotal), 2));
                            desvioPadraoPonderadoAcertos = desvioPadraoPonderadoAcertos + (Math.pow((WeightedAcerts[m] - mediaAcertoPonderadoTotal), 2));
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

                        let resultsCSV = fs.createWriteStream('uploads/results.csv');

                        csv.write(resultsArray, {headers: true})
                            .pipe(resultsCSV);
                    });
                })
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
