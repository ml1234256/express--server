let express = require('./lib/express');
let path = require('path');
let bodyParser = require('./lib/body-parser');

let app = express();

app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', (req, res) => {
	res.send("<h1>My Express</h1>");
})

app.use((req, res) => {
	res.send(404, 'haha Not Found');
})

module.exports = app;        