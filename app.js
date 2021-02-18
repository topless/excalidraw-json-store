'use strict';

const express = require('express');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { createFile, listFiles } = require('./storage');

const app = express();

app.use(express.static('static'));
app.use('/static', express.static('static'));

app.use(function (req, res, next) {
  var data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    req.body = data;
    next();
  });
});

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: __dirname });
});

app.post('/', (req, res) => {
  listFiles().catch(console.error);
  const fileId = createFile(req.body);
  const dataUrl = `${req.get('Host')}/${fileId}`;
  res.json({ id: fileId, data: dataUrl });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
