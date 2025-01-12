const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const NFS_PATH = process.env.NFS_PATH || '/mnt/nfs';

router.post('/upload', async (req, res) => {
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

router.get('/:fileId', async (req, res) => {
  const filePath = path.join(NFS_PATH, req.params.fileId);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    res.status(200).json({ content });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'File not found' });
  }
});

router.put('/:fileId', async (req, res) => {
  const filePath = path.join(NFS_PATH, req.params.fileId);
  const { content } = req.body;

  try {
    await fs.writeFile(filePath, content);
    res.status(200).json({ message: 'File updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

router.delete('/:fileId', async (req, res) => {
  const filePath = path.join(NFS_PATH, req.params.fileId);

  try {
    await fs.remove(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
