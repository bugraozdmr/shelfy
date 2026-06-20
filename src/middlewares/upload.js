const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shelfy',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'jpeg'],
    transformation: [{ width: 500, height: 750, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

module.exports = upload;