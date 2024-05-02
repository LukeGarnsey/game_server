const express = require("express");
const gameServer = require('./game/gameServer');
// const chatServer = require("./chat/chatServer");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 4001;

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
app.post('/createGame', (req, res) =>{
  const { key } = req.body;

  console.log(key);

  res.status(200).json({data:'recieved'});
});
const expressServer = app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});

gameServer(expressServer)