const express = require('express');
const router = express.Router();
const authenticateKeycloakToken = require('../middleware/authenticateKeycloakToken');
const fs = require('fs-extra');
const path = require('path');

const NFS_PATH = process.env.NFS_PATH || '/mnt/nfs';

router.post('/upload', authenticateKeycloakToken, async (req, res) => {
  const { fileName, content } = req.body;
  const filePath = path.join(NFS_PATH, fileName);

  try {
    await fs.writeFile(filePath, content);
    res.status(201).json({ message: 'File uploaded successfully', fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.get('/:fileId', authenticateKeycloakToken, async (req, res) => {
  const filePath = path.join(NFS_PATH, req.params.fileId);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    res.status(200).json({ content });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;
