const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure that the uploads folder exists
const ensureUploadsFolderExists = () => {
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('Uploads folder created.');
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the uploads folder exists before setting the destination
    ensureUploadsFolderExists();
    cb(null, path.join(__dirname, '..', 'uploads')); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const email = req.body.email.replace(/[@.]/g, '_');
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${email}_${timestamp}${ext}`); // Filename format: email_timestamp.extension
  },
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
};

// Export the configured multer instance
const multerConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 }, // Max file size: 2MB
});

module.exports = multerConfig;
