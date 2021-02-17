'use strict';

const express = require('express');

const app = express();

app.use(express.static('static'));
app.use('/static', express.static('static'));

const rawDataMiddleWare = (req, res, next) => {
  var data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    req.body = data;
    next();
  });
};

app.use(rawDataMiddleWare);

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: __dirname });
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
