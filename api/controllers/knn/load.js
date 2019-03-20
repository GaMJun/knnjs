const fs = require("fs");
const csv = require("fast-csv");
const LinkedList = require('dbly-linked-list');

// Shuffling arrays function
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = {
    friendlyName: 'Loads an initial dataset',
    description: 'Carrega o dataset inicial para o classificador',
    sideEffects: 'cacheable',
    sync: true,
    inputs: {
        file_path: {
            type: 'string',
            required: false,
        }
    },
    exits: {
        loaded: {
            statusCode: 200,
            outputExample: {level: 'INFO', message: 'Dataset carregado com sucesso!'},
            outputFriendlyName: 'Carregado com sucesso com sucesso',
            outputDescription: 'Retorna uma mensagem de sucesso',
        },
        badRequest: {
            statusCode: 400,
            description: 'Requisição mal formada',
            outputExample: {
                level: 'ERROR',
                message: 'Requisição mal formada',
                error: 'Parâmetros mal formados'
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
            let dataSetArray_C1 = []; // All class 1 type objects
            let dataSetArray_C2 = []; // All class 2 type objects
            let validationArray = []; // 25% of dataSet
            let testArray = []; // 25% of dataSet
            let trainingArray = []; // Remaining percent of the dataset
            let sizeByPercentTestC1 = 0;
            let sizeByPercentTestC2 = 0;
            let sizeByPercentValidationC1 = 0;
            let sizeByPercentValidationC2 = 0;
            let randomIndex = 0;
            let trainingCSV = fs.createWriteStream('uploads/training.csv');
            let validationCSV = fs.createWriteStream('uploads/validation.csv');
            let testCSV = fs.createWriteStream('uploads/test.csv');

            // Reading and storing dataset in a linked list of objects separated by instance
            csv.fromPath(inputs.file_path, {headers: true}).on("data", function (data) {
                dataSetList.insert(data);
            }).on("end", function () {

                // Sorting out dataset in class 1 and class 2
                while (!dataSetList.isEmpty()) {
                    if (dataSetList.getHeadNode().getData().Class === '1') {
                        dataSetArray_C1.push(dataSetList.getHeadNode().getData());
                        dataSetList.removeFirst()
                    } else {
                        dataSetArray_C2.push(dataSetList.getHeadNode().getData());
                        dataSetList.removeFirst()
                    }
                }

                // Getting the size or instaces of each array based on the percent
                sizeByPercentTestC1 = Math.round((25 * dataSetArray_C1.length) / 100);
                sizeByPercentTestC2 = Math.round((25 * dataSetArray_C2.length) / 100);
                sizeByPercentValidationC1 = Math.round((25 * dataSetArray_C1.length) / 100);
                sizeByPercentValidationC2 = Math.round((25 * dataSetArray_C2.length) / 100);

                // Populating randomly the Test and Validation arrays
                while (sizeByPercentTestC1 > 0) {
                    randomIndex = Math.floor(Math.random() * (dataSetArray_C1.length));
                    testArray.push(dataSetArray_C1[randomIndex]);
                    dataSetArray_C1.splice(randomIndex, 1);
                    sizeByPercentTestC1--;
                }

                while (sizeByPercentTestC2 > 0) {
                    randomIndex = Math.floor(Math.random() * (dataSetArray_C2.length));
                    testArray.push(dataSetArray_C2[randomIndex]);
                    dataSetArray_C2.splice(randomIndex, 1);
                    sizeByPercentTestC2--;
                }

                while (sizeByPercentValidationC1 > 0) {
                    randomIndex = Math.floor(Math.random() * (dataSetArray_C1.length));
                    validationArray.push(dataSetArray_C1[randomIndex]);
                    dataSetArray_C1.splice(randomIndex, 1);
                    sizeByPercentValidationC1--;
                }
                while (sizeByPercentValidationC2 > 0) {
                    randomIndex = Math.floor(Math.random() * (dataSetArray_C2.length));
                    validationArray.push(dataSetArray_C2[randomIndex]);
                    dataSetArray_C2.splice(randomIndex, 1);
                    sizeByPercentValidationC2--;
                }
                // End of populating randomly

                // Training array is the remaining
                trainingArray = dataSetArray_C1.concat(dataSetArray_C2);

                // Shuffles the arrays
                shuffle(testArray);
                shuffle(validationArray);
                shuffle(trainingArray);

                // Writing it down
                csv.write(trainingArray, {headers: true}).pipe(trainingCSV);
                csv.write(validationArray, {headers: true}).pipe(validationCSV);
                csv.write(testArray, {headers: true}).pipe(testCSV);

            });
            return exits.loaded({
                level: 'INFO',
                message: 'Base de dados carregada e dividida com sucesso. Armazenado em: ',
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
