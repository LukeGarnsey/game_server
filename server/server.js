const express = require("express");
const chatServer = require("./chat/chatServer");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}else
{
  app.get('*', (req, res) =>{
    res.send("You are on the server");
  });
}

const expressServer = app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});

chatServer(expressServer)