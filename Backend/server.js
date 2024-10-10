const express = require('express');
const cors = require('cors');
const app = express();
var reqSend = require('./Controller/userReq');
var reqGetData= require('./Controller/userGetData');

app.use(cors()); // Enable CORS
app.use(express.json()); // To parse JSON request bodies

app.post('/send', reqSend);

app.get('/getData', reqGetData);
const port=process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Server running on port 3001");
});
