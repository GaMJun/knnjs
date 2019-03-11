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
        function shuffle(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        try {


            const csv = require("fast-csv");
            const LinkedList = require('dbly-linked-list');

            let dataSetList = new LinkedList();
            let dataSetArray_C1 = []; // All objects of type class 1
            let dataSetArray_C2 = []; // All objects of type class 2
            let trainingArray = []; // 50% of dataSet
            let validationArray = []; // 25% of dataSet
            let testArray = [] // 25% of dataSet

            csv.fromPath(inputs.file_path, {headers: true}).on("data", function (data) {
                dataSetList.insert(data);
                //console.log(data);
            })
                .on("end", function () {
                    //console.log("done");
                    // console.log(dataSetList.getSize())

                    let empty = dataSetList.isEmpty();

                    while (!empty){
                        let object = dataSetList.getHeadNode().getData();

                        if(object.Class === '1'){
                            dataSetArray_C1.push(object);
                            dataSetList.removeFirst()
                        } else if(object.Class === '2'){
                            dataSetArray_C2.push(object);
                            dataSetList.removeFirst()
                        }
                        empty = dataSetList.isEmpty();
                    }

                    let testPorcentation_C1 = Math.round((25 * dataSetArray_C1.length) / 100);
                    let testPorcentation_C2 = Math.round((25 * dataSetArray_C2.length)/ 100);
                    let validationPorcentation_C1 = Math.round((25 * dataSetArray_C1.length) / 100);
                    let validationPorcentation_C2 = Math.round((25 * dataSetArray_C2.length) / 100);
                    let randonPosition = 0;


                    while (testPorcentation_C1 > 0){
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C1.length))
                        testArray.push(dataSetArray_C1[randonPosition]);
                        dataSetArray_C1.splice(randonPosition,1);
                        testPorcentation_C1--;
                    }
                    while (testPorcentation_C2 > 0){
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C2.length))
                        testArray.push(dataSetArray_C2[randonPosition]);
                        dataSetArray_C2.splice(randonPosition,1);
                        testPorcentation_C2--;
                    }

                    while (validationPorcentation_C1 > 0){
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C1.length))
                        validationArray.push(dataSetArray_C1[randonPosition]);
                        dataSetArray_C1.splice(randonPosition,1);
                        validationPorcentation_C1--;
                    }
                    while (validationPorcentation_C2 > 0){
                        randonPosition = Math.floor(Math.random() * (dataSetArray_C2.length))
                        validationArray.push(dataSetArray_C2[randonPosition]);
                        dataSetArray_C2.splice(randonPosition,1);
                        validationPorcentation_C2--;
                    }

                    trainingArray = dataSetArray_C1.concat(dataSetArray_C2);

                    shuffle(testArray);
                    shuffle(validationArray);
                    shuffle(trainingArray);



                    // Algorithm starts here

                    let k = 5;
                    let majorityVotes = []; // Vetor para os votos majoritários
                    let minors = [];
                    let minorsIndex = [];
                    let majorityAcertCounter = 0;
                    let majorityErrosCounter = 0;
                    let weightedVotes = []; // Vetor para os votos ponderados

                    for (let i=0; i < k; i++){
                        minors[i] = 1000000;
                        minorsIndex[i] = 0;
                    }

                    for (let i=0; i < validationArray.length; i++){
                        for (let j=0; j < trainingArray.length; j++){
                            majorityVotes[j] = Math.sqrt(
                                Math.pow(validationArray[i].A1 - trainingArray[j].A1, 2) +
                                Math.pow(validationArray[i].A2 - trainingArray[j].A2, 2) +
                                Math.pow(validationArray[i].A3 - trainingArray[j].A3, 2) +
                                Math.pow(validationArray[i].A4 - trainingArray[j].A4, 2) +
                                Math.pow(validationArray[i].A5 - trainingArray[j].A5, 2) +
                                Math.pow(validationArray[i].A6 - trainingArray[j].A6, 2) +
                                Math.pow(validationArray[i].A7 - trainingArray[j].A7, 2) +
                                Math.pow(validationArray[i].A8 - trainingArray[j].A8, 2) +
                                Math.pow(validationArray[i].A9 - trainingArray[j].A9, 2) +
                                Math.pow(validationArray[i].A10 - trainingArray[j].A10, 2) +
                                Math.pow(validationArray[i].A11 - trainingArray[j].A11, 2) +
                                Math.pow(validationArray[i].A12 - trainingArray[j].A12, 2) +
                                Math.pow(validationArray[i].A13 - trainingArray[j].A13, 2) +
                                Math.pow(validationArray[i].A14 - trainingArray[j].A14, 2)
                            );
                        }

                        majorityVotes.forEach(function (vote, index) {
                            if (vote < minors[0]){

                                for (let j=minors.length - 1; j > 0;j--){
                                    minors[j] = minors[j-1];
                                    minorsIndex[j] = minorsIndex[j-1];
                                }
                                minors[0] = vote;
                                minorsIndex[0] = index;
                            }
                        });

                        let class1 = 0;
                        let class2 = 0;


                        minorsIndex.forEach(function (position) {
                            if(testArray[position].Class === '1'){
                                class1++;
                            }else{
                                class2++;
                            }
                        });

                        if (class1 > class2){
                            if (validationArray[i].Class === '1'){
                                majorityAcertCounter++;
                            }else {
                                majorityErrosCounter++;
                            }
                        } else if (class1 < class2){
                            if (validationArray[i].Class === '2'){
                                majorityAcertCounter++;
                            }else {
                                majorityErrosCounter++;
                            }
                        }

                    }

                    console.log(majorityAcertCounter);
                    console.log(majorityErrosCounter);

                });


            return exits.created({
                level: 'ERROR',
                message: 'FOI' + a,
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
