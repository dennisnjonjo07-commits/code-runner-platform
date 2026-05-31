const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const extractZip = require('extract-zip');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userUploadDir = path.join(uploadDir, 'temp');
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    cb(null, userUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Upload file
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const projectId = uuidv4();
    const projectDir = path.join(uploadDir, projectId);
    fs.mkdirSync(projectDir, { recursive: true });

    // Move file
    const filePath = path.join(projectDir, req.file.originalname);
    fs.copyFileSync(req.file.path, filePath);
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'File uploaded successfully',
      projectId,
      filename: req.file.originalname,
      filepath: filePath,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Upload and extract ZIP
router.post('/zip', upload.single('file'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.file.originalname.endsWith('.zip')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Only ZIP files are supported' });
    }

    const projectId = uuidv4();
    const projectDir = path.join(uploadDir, projectId);
    fs.mkdirSync(projectDir, { recursive: true });

    // Extract ZIP
    await extractZip(req.file.path, { dir: projectDir });
    fs.unlinkSync(req.file.path);

    // Get extracted files
    const files = getFilesRecursive(projectDir);

    res.json({
      message: 'ZIP extracted successfully',
      projectId,
      extractedTo: projectDir,
      filesCount: files.length,
      files: files.slice(0, 20) // Return first 20 files
    });
  } catch (error) {
    console.error('ZIP extraction error:', error);
    res.status(500).json({ error: 'ZIP extraction failed' });
  }
});

function getFilesRecursive(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getFilesRecursive(fullPath));
    } else {
      files.push(fullPath.replace(uploadDir, ''));
    }
  });

  return files;
}

module.exports = router;
