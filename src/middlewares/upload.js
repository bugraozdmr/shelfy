const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (req.baseUrl.includes('/api/print')) return 'shelfy/print';
      if (req.baseUrl.includes('/api/movies')) return 'shelfy/movies';
      if (req.baseUrl.includes('/api/series') || req.baseUrl.includes('/api/seasons')) return 'shelfy/series';
      return 'shelfy/others';
    },
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 750, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

module.exports = upload;