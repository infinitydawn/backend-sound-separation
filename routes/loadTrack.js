const express = require('express');
const router = express.Router();
const { addTaskToQueue } = require('../utils/queueManager');

router.get('/', (req, res) => {
  const fileId = req.query.fileId;
  
  addTaskToQueue(fileId, (err, result) =>{
      if(err){
        res.status(500).json({error: err.message})
      }

      res.json({message: result, fileId})
  })
});

module.exports = router;
