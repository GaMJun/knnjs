const csv = require("fast-csv");

module.exports = {
    friendlyName: 'Validates an k to the best case',
    description: 'Encontra um k que obtém o melhor desempenho',
    sideEffects: 'cacheable',
    sync: true,
    exits: {
        validated: {
            statusCode: 201,
            outputExample: {level: 'INFO', message: 'Validado com sucesso!'},
            outputFriendlyName: 'Validado com sucesso',
            outputDescription: 'Retorna uma mensagem de sucesso',
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

    fn: function (dumb, exits) {
        try {
            let trainingArray = []; // 50% of dataSet
            let validationArray = []; // 25% of dataSet
            let majorityVotes = []; // Array of majority votes
            let majorityHitCounter = 0; // Counter of hits from majority votes
            let majorityMissCounter = 0; // Counter of miss from majority votes
            let weightedVotes = []; // Array of weighted votes
            let weightedHitCounter = 0; // Counter of hits from weighted votes
            let weightedMissCounter = 0; // Counter of miss from weighted votes
            let majoritaryAvg = 0;
            let weightedAvg = 0;
            let results = [];

            csv.fromPath('uploads/training.csv', {headers: true}).on("data", function (data) {
                trainingArray.push(data);
            }).on("end", function () {
                    csv.fromPath('uploads/validation.csv', {headers: true}).on("data", function (data) {
                        validationArray.push(data)
                    }).on("end", function () {

                        function alertFinished() {
                            return exits.validated({
                                results: results,
                                message: 'Validado com sucesso. Agora escolha o K que melhor lhe agrade',
                            });
                        }

                        hell(alertFinished);

                        function hell(callback) {
                            // Oscillating the value of K in odd numbers between 1 and 15
                            for (let k = 1; k <= 15; k = k + 2) {

                                majoritaryAvg = 0;
                                weightedAvg = 0;

                                majorityHitCounter = 0;
                                majorityMissCounter = 0;
                                weightedHitCounter = 0;
                                weightedMissCounter = 0;

                                // For each validationArray instance
                                for (let i = 0; i < validationArray.length; i++) {
                                    // Run every trainingArray instances
                                    for (let j = 0; j < trainingArray.length; j++) {

                                        // Calculating the Euclidean distance between the item in the validation vector and each item in the training vector
                                        // Storing in majorityVotes array
                                        majorityVotes[j] = Math.sqrt(
                                            (Math.pow((validationArray[i].A1 - trainingArray[j].A1), 2) +
                                                Math.pow((validationArray[i].A2 - trainingArray[j].A2), 2) +
                                                Math.pow((validationArray[i].A3 - trainingArray[j].A3), 2) +
                                                Math.pow((validationArray[i].A4 - trainingArray[j].A4), 2) +
                                                Math.pow((validationArray[i].A5 - trainingArray[j].A5), 2) +
                                                Math.pow((validationArray[i].A6 - trainingArray[j].A6), 2) +
                                                Math.pow((validationArray[i].A7 - trainingArray[j].A7), 2) +
                                                Math.pow((validationArray[i].A8 - trainingArray[j].A8), 2) +
                                                Math.pow((validationArray[i].A9 - trainingArray[j].A9), 2) +
                                                Math.pow((validationArray[i].A10 - trainingArray[j].A10), 2) +
                                                Math.pow((validationArray[i].A11 - trainingArray[j].A11), 2) +
                                                Math.pow((validationArray[i].A12 - trainingArray[j].A12), 2) +
                                                Math.pow((validationArray[i].A13 - trainingArray[j].A13), 2) +
                                                Math.pow((validationArray[i].A14 - trainingArray[j].A14), 2))
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
                                        minors[i] = Infinity;
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
                                                majorityVotes[j] = Infinity;
                                            }
                                        }
                                    }

                                    // Vote counter for the classes
                                    let class1 = 0;
                                    let class2 = 0;

                                    minorsIndex.forEach(function (position) {
                                        trainingArray[position].Class === '1' ? class1++ : class2++;
                                    });

                                    // Validating the majoritary votes
                                    if (class1 > class2) {
                                        validationArray[i].Class === '1' ? majorityHitCounter++ : majorityMissCounter++;
                                    } else if (class1 < class2) {
                                        validationArray[i].Class === '2' ? majorityHitCounter++ : majorityMissCounter++;
                                    }


                                    // Weighted Votes

                                    // Finding the k biggers values
                                    for (let i = 0; i < k; i++) {
                                        for (let j = 0; j < weightedVotes.length; j++) {
                                            if (biggers[i] < weightedVotes[j]) {
                                                biggers[i] = weightedVotes[j];
                                                biggersIndex[i] = j;
                                                weightedVotes[j] = 0;
                                            }
                                        }
                                    }

                                    // Vote counter for the classes reset
                                    class1 = 0;
                                    class2 = 0;

                                    biggersIndex.forEach(function (position, index) {
                                        trainingArray[position].Class === '1' ? class1 = class1 + biggers[index] : class2 = class2 + biggers[index];
                                    });

                                    // Validating the weighted votes
                                    if (class1 > class2) {
                                        validationArray[i].Class === '1' ? weightedHitCounter++ : weightedMissCounter++;
                                    } else if (class1 < class2) {
                                        validationArray[i].Class === '2' ? weightedHitCounter++ : weightedMissCounter++;
                                    }

                                }
                                majoritaryAvg = majoritaryAvg + ((majorityHitCounter * 100) / (majorityHitCounter + majorityMissCounter));
                                weightedAvg = weightedAvg + ((weightedHitCounter * 100) / (weightedHitCounter + weightedMissCounter));

                                let result = {
                                    'k': k,
                                    'majoritaryAvg': majoritaryAvg,
                                    'weightedAvg': weightedAvg
                                };
                                results.push(result)
                            }
                            callback();
                        }
                    });
                }
            );
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
