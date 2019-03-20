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
        iterations: {
            type: 'number',
            required: true
        },
        file_path: {
            type: 'string',
            required: true,
        },
    },
    exits: {
        tested: {
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
            let dataSetArray_C1 = []; // All objects of type class 1
            let dataSetArray_C2 = []; // All objects of type class 2
            let trainingArray = []; // 50% of dataSet
            let validationArray = []; // 25% of dataSet
            let testArray = [];// 25% of dataSet

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

            let mediaAcertoMajoritario = 0;
            let mediaErroMajoritario = 0;
            let mediaAcertoPonderado = 0;
            let mediaErroPonderado = 0;

            let countTest = 0;

            let storeMajorityAcerts = {};

            let storeMajorityErros = {};

            let storeWeightedAcerts = {};

            let storeWeightedErros = {};

            let resultsArray = [];

            readFiles(doTest);

            function readFiles(callback) {
                csv.fromPath(inputs.file_path, {headers: true}).on("data", function (data) {
                    dataSetList.insert(data);
                    // dataSetArray.push(data);
                }).on("end", function () {
                    csv.fromPath('uploads/training.csv', {headers: true}).on("data", function (data) {
                        trainingArray.push(data);
                    }).on("end", function () {
                        csv.fromPath('uploads/test.csv', {headers: true}).on("data", function (data) {
                            testArray.push(data)
                        }).on("end", function () {
                            callback(writeFile);
                        });
                    });
                });
            }

            function doTest(callback) {
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
                    for (let i = 0; i < inputs.k; i++) {
                        minors[i] = 1000000;
                        minorsIndex[i] = 0;

                        biggers[i] = 0;
                        biggersIndex[i] = 0;
                    }

                    //Majoritary Votes

                    // Finding the k minors values
                    for (let i = 0; i < inputs.k; i++) {
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
                    for (let i = 0; i < inputs.k; i++) {
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

                MajorityAcerts[countTest] = mediaAcertoMajoritario;
                MajorityErros[countTest] = mediaErroMajoritario;

                mediaAcertoPonderado = ((weightedHitCounter * 100) / (weightedHitCounter + weightedMissCounter));
                mediaErroPonderado = ((weightedMissCounter * 100) / (weightedHitCounter + weightedMissCounter));

                WeightedAcerts[countTest] = mediaAcertoPonderado;
                WeightedErros[countTest] = mediaErroPonderado;

                mediaAcertoMajoritarioTotal = mediaAcertoMajoritarioTotal + mediaAcertoMajoritario;
                mediaErroMajoritarioTotal = mediaErroMajoritarioTotal + mediaErroMajoritario;

                mediaAcertoPonderadoTotal = mediaAcertoPonderadoTotal + mediaAcertoPonderado;
                mediaErroPonderadoTotal = mediaErroPonderadoTotal + mediaErroPonderado;


                //Change files
                dataSetArray_C1 = []; // All objects of type class 1
                dataSetArray_C2 = []; // All objects of type class 2
                trainingArray = []; // 50% of dataSet
                validationArray = []; // 25% of dataSet
                testArray = [];// 25% of dataSet

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
                countTest++;
                callback();
            }

            function writeFile() {
                // Removing older files
                fs.unlinkSync('uploads/training.csv');
                fs.unlinkSync('uploads/validation.csv');
                fs.unlinkSync('uploads/test.csv');

                // Writing new files
                let trainingCSV = fs.createWriteStream('uploads/training.csv');
                let validationCSV = fs.createWriteStream('uploads/validation.csv');
                let testCSV = fs.createWriteStream('uploads/test.csv');

                csv.write(trainingArray, {headers: true})
                    .pipe(trainingCSV).on("finish", function () {
                    csv.write(validationArray, {headers: true})
                        .pipe(validationCSV).on("finish", function () {
                        csv.write(testArray, {headers: true})
                            .pipe(testCSV).on("finish", function () {
                            dataSetList = new LinkedList();
                            validationArray = [];
                            trainingArray = [];
                            testArray = [];
                            countTest < inputs.iterations ? readFiles(doTest) : writeResults();
                        });
                    });
                });
            }

            function writeResults() {
                //Averages calculation
                mediaAcertoMajoritarioTotal = (mediaAcertoMajoritarioTotal / inputs.iterations);
                mediaErroMajoritarioTotal = mediaErroMajoritarioTotal / inputs.iterations;

                mediaAcertoPonderadoTotal = mediaAcertoPonderadoTotal / inputs.iterations;
                mediaErroPonderadoTotal = mediaErroPonderadoTotal / inputs.iterations;


                //Standard Deviation Calculation (DP)
                let desvioPadraoMajoritarioAcertos = 0;
                let desvioPadraoMajoritarioErros = 0;
                let desvioPadraoPonderadoAcertos = 0;
                let desvioPadraoPonderadoErros = 0;

                for (let m = 0; m < inputs.iterations; m++) {
                    desvioPadraoMajoritarioAcertos = desvioPadraoMajoritarioAcertos + (Math.pow((MajorityAcerts[m] - mediaAcertoMajoritarioTotal), 2));
                    desvioPadraoMajoritarioErros = desvioPadraoMajoritarioErros + (Math.pow((MajorityErros[m] - mediaErroMajoritarioTotal), 2));
                    desvioPadraoPonderadoAcertos = desvioPadraoPonderadoAcertos + (Math.pow((WeightedAcerts[m] - mediaAcertoPonderadoTotal), 2));
                    desvioPadraoPonderadoErros = desvioPadraoPonderadoErros + (Math.pow((WeightedErros[m] - mediaErroPonderadoTotal), 2));
                }



                desvioPadraoMajoritarioAcertos = Math.sqrt(((desvioPadraoMajoritarioAcertos)/(inputs.iterations-1)));
                desvioPadraoMajoritarioErros = Math.sqrt(((desvioPadraoMajoritarioErros)/(inputs.iterations-1)));
                desvioPadraoPonderadoAcertos = Math.sqrt(((desvioPadraoPonderadoAcertos)/(inputs.iterations-1)));
                desvioPadraoPonderadoErros = Math.sqrt(((desvioPadraoPonderadoErros)/(inputs.iterations-1)));

                for (let i = 0; i < inputs.iterations; i++) {
                    storeMajorityAcerts[i.toString()] = MajorityAcerts[i];
                    storeMajorityErros[i.toString()] = MajorityErros[i];
                    storeWeightedAcerts[i.toString()] = WeightedAcerts[i];
                    storeWeightedErros[i.toString()] = WeightedErros[i];

                }
                storeMajorityAcerts.μ = mediaAcertoMajoritarioTotal;
                storeMajorityAcerts.σ = desvioPadraoMajoritarioAcertos;
                resultsArray.push(storeMajorityAcerts);

                storeMajorityErros.μ = mediaErroMajoritarioTotal;
                storeMajorityErros.σ = desvioPadraoMajoritarioErros;
                resultsArray.push(storeMajorityErros);

                storeWeightedAcerts.μ = mediaAcertoPonderadoTotal;
                storeWeightedAcerts.σ = desvioPadraoPonderadoAcertos;
                resultsArray.push(storeWeightedAcerts);

                storeWeightedErros.μ = mediaErroPonderadoTotal;
                storeWeightedErros.σ = desvioPadraoPonderadoErros;
                resultsArray.push(storeWeightedErros);

                let resultsCSV = fs.createWriteStream('uploads/results.csv');

                csv.write(resultsArray, {headers: true})
                    .pipe(resultsCSV).on("finish", function () {
                    alertFinished();
                });
            }

            function alertFinished() {
                return exits.tested({
                    level: 'INFO',
                    message: 'Resultados para k=' + inputs.k,
                    storeMajorityAcerts: storeMajorityAcerts,
                    storeWeightedAcerts: storeWeightedAcerts,
                    storeMajorityErros: storeMajorityErros,
                    storeWeightedErros: storeWeightedErros,
                });
            }
        } catch
            (err) {
            return exits.internalError({
                level: 'ERROR',
                message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
                error: err
            });
        }
    }
}
;
