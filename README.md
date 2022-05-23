# Quick and dirty example of image processing with queue

1. npm install
2. requires a redis instance running
3. create the appropriate directories `mkdir -p upload output`  
4. run the server and the worker: `node worker.js & node index.js`
visit localhost:8888 and upload a jpeg file 
