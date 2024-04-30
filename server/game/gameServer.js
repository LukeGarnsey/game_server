const {Server} = require("socket.io");
const lobby = require("./lobby");
const gameRoom = require('./gameRoom');

module.exports = (expressServer)=>{
  let activeGameRooms = [];
  const io = new Server(expressServer, {
    cors:{
      origin: process.env.NODE_ENV === "production"?false:['http://localhost:3000', 'http://127.0.0.1:3000']
    }
  });
  const lobbyObject = lobby(io);
  io.on('connection', client =>{
    console.log(`Client ${client.id} connected`);

    placeInLobby(client);
    
  });
  function placeInGame(client){
    const gameInstance = gameRoom(io, [client], 'myID', exitGame);
    activeGameRooms.push(gameInstance);
    activeGameRooms.forEach(x=>console.log(x.gameId));
  }
  function exitGame(gameInstance, client){
    activeGameRooms = [
      ...activeGameRooms.filter(item => item.gameId !== gameInstance.gameId)
    ];
    activeGameRooms.forEach(x=>console.log(x.gameId));
    placeInLobby(client);
  }
  function placeInLobby(client){
    lobbyObject.addClient(client, placeInGame);
  }
};