const express = require('express');
const Multer = require('multer');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { createFile, downloadFile } = require('./storage');

const app = express();
app.use(express.static('static'));
app.use('/static', express.static('static'));

Multer({
  storage: Multer.memoryStorage(),
});

app.use((req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
});

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: __dirname });
});

app.post('/', (req, res) => {
  const fileId = createFile(req.body);
  const dataUrl = `${req.get('Host')}/${fileId}`;
  res.json({ id: fileId, data: dataUrl });
});

app.get('/:uuid', (req, res) => {
  const fname = req.params.uuid;
  res.setHeader('Content-disposition', `attachment; filename=${fname}`);
  downloadFile(fname).then(
    (data) => res.send(data[0]),
    (err) => {
      console.error(err);
      res.json({ code: err.code, message: err.message });
    }
  );
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
