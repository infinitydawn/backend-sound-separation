const async = require('async');
const processFile = require('./processFile'); 

// define what happens to each item in queue
// run processFile util -> when result available
const queue = async.queue((data, callback) => {
  processFile(data.fileId, data.params, callback); 
}, 5);

// add a task to queue
const addTaskToQueue = (fileId,params, callback) => {
    queue.push({ fileId, params }, callback);
};

module.exports = {
  addTaskToQueue,
};