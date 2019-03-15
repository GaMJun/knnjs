'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

//const upload = multer();
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 10},
});

module.exports = async function (app) {
    const asAction = require('machine-as-action'); //machine to build the functions

    app.route('/knn')
        .post(upload.single('file'), (req, res, next) => {
            req.params.app = app;
            req.params.file_path = req.file.path;
            next();
        }, asAction(app.controllers.knn.load));

    app.route('/knn')
        .get((req, res, next) => {
            req.params.app = app;
            req.params.headers = req.headers;
            next();
        }, asAction(app.controllers.knn.validation));

    app.route('/knnTest')
        .post((req, res, next) => {
            req.params.app = app;
            req.params.headers = req.headers;
            next();
        }, asAction(app.controllers.knn.test));

    // app.route('/restricted')
    //     .get((req, res, next) => {
    //         req.params.app = app;
    //         req.params.headers = req.headers;
    //         next()
    //     }, asAction(app.controllers.ademir.account.get));
    //
    // app.route('/restricted')
    //     .patch((req, res, next) => {
    //         req.params.app = app;
    //         req.params.headers = req.headers;
    //         if (validateIncommingInfo(req.body, res)) next();
    //     }, asAction(app.controllers.ademir.account.update));
    //
    // app.route('/restricted')
    //     .delete((req, res, next) => {
    //         req.params.app = app;
    //         req.params.headers = req.headers;
    //         next()
    //     }, asAction(app.controllers.ademir.account.delete));
};
