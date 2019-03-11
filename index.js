'use strict';
const http = require('http');
const express = require('express'); // for express
const bodyParser = require('body-parser'); // for middleware
const consign = require('consign'); // for load routes
const helmet = require('helmet'); // for security
const cors = require('cors'); // for enable cors


const app = express();
const port = process.env.PORT || 3712;

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`KNNJS is running in port: ${port}`);
});

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
	limit: '35mb',
	extended: true
}));
app.use(bodyParser.json({
	limit: '35mb'
})); // parse application/json
app.use(require('method-override')());
app.use(cors());

// enable helmet
app.use(helmet());
// disable X-Powered-By header
app.disable('x-powered-by');
// fake x-powered-by php
app.use(helmet.hidePoweredBy({
	setTo: 'PHP 5.6.9'
}));
// Don't allow me to be in ANY frames:
app.use(helmet.frameguard({
	action: 'deny'
}));
// filter XSS
app.use(helmet.xssFilter());
// Mime type don't on browser
app.use(helmet.noSniff());
consign({cwd: 'api'})
 .include('controllers')
 .then('routes')
 .into(app)

