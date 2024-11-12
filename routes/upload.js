const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageConfig = require('../config/multerConfig');  // Import multer storage configuration
const { addTaskToQueue } = require('../utils/queueManager'); 



const storageTool = multer({ storage: storageConfig });


// multer saves file -> add task to queue -> when task done send response
router.post('/', storageTool.single('file'), (req, res) => {
  const data = {
    fileId: req.file.filename,

  }
  const fileId = req.file.filename;

  addTaskToQueue(fileId, function(err, result){
    if (err){
        return res.status(500).json({ error: err.message})
    }

    res.json({message: result, fileId})
  })
  
});

module.exports = router;
