const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const Queue = require('bee-queue');
const jimpQueue = new Queue('jimpq');
const fs = require('fs')

const port = process.env.PORT || 8888;
app.listen(port)
app.use(fileUpload());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// nothing guarantees we already have the image ...
// so .. we can totally wait here until we get it.
app.get('/output/:file', (req, res) => {

  outFile= path.join(__dirname, "output",path.basename(req.params.file));

  fs.access(outFile, fs.F_OK, (err) => {
    if (err) {
      console.error("Image does not exist yet");
      console.error(err);
      res.status(409).send('Image still processing.'); 
      return
    }
    res.sendFile(outFile); 
  })
 
});

app.post('/upload', function(req, res) {
  let fileUpload;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  fileUpload = req.files.fileUpload;
  uploadPath = __dirname + '/upload/' + fileUpload.name;
  fileUpload.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);  
      const job = jimpQueue.createJob({path: uploadPath});
      job
        .timeout(3000)
        .retries(2)
        .save()
        .then((job) => {
          console.log(`${job.id} is done`);
          res.redirect(301, `output/${path.basename(job.data.path)}`);     
        });
  });
});
