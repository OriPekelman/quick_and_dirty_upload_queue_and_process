const Queue = require('bee-queue');
var path = require("path");
const jimpQueue = new Queue('jimpq');
var Jimp = require('jimp');
 
jimpQueue.process(function (job, done) {
  console.log(`Processing job ${job.id}`);
  Jimp.read(job.data.path, (err, img) => {
  if (err) throw err;
  outFile= path.join(__dirname, "output",path.basename(job.data.path));
  img
    .resize(256, 256) // resize
    .quality(60) // set JPEG quality
    .greyscale() // set greyscale
    .write(outFile); // save
    console.log('written ' + outFile);
}
);
  
  return done(null, job.data.path);
});
