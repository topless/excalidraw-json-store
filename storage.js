'use strict';

const DEFAULT_BUCKET = 'excalidraw-bucket';

const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = process.env.GCLOUD_STORAGE_BUCKET || DEFAULT_BUCKET;
const bucket = storage.bucket(bucketName);

async function listFiles() {
  const [files] = await bucket.getFiles();
  console.log('Files:');
  files.forEach((file) => {
    console.log(file.name);
  });
}

function createFile(data) {
  const uuid = uuidv4();
  const file = bucket.file(uuid);
  file.save(data, console.error);
  return uuid;
}

module.exports = {
  createFile: createFile,
  listFiles: listFiles,
};
