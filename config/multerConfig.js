const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}-${file.originalname}`;
    cb(null, fileName);
  },
});

module.exports = storage;
