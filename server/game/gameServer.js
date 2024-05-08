const {Server} = require("socket.io");
const lobby = require("./lobby");
const gameRoom = require('./gameRoom');
const { generateRandomAlphaNumeric } = require("../util/random");

module.exports = (expressServer)=>{
  let activeGameRooms = [];
  const io = new Server(expressServer, {
    cors:{
      origin: process.env.NODE_ENV === "production"?false:['http://localhost:4000', 'http://127.0.0.1:4000']
    }
  });
  const lobbyObject = lobby(io, placeInGame, joinGame);
  io.on('connection', client =>{
    console.log(`Client ${client.id} connected`);

    placeInLobby(client);
    
  });
  function placeInGame(clients){
    const gameInstance = gameRoom(io, clients, generateRandomAlphaNumeric(8), exitGame);
    activeGameRooms.push(gameInstance);
    activeGameRooms.forEach(x=>console.log(x.gameId));
    return gameInstance;
  }
  const placeInGameFunction = (clients) => {
    const gameInstance = gameRoom(io, clients, generateRandomAlphaNumeric(8), exitGame);
    activeGameRooms.push(gameInstance);
    activeGameRooms.forEach(x=>console.log(x.gameId));
    return gameInstance;
  }
  function joinGame(client, gameId){
    const room = activeGameRooms.find(item => item.gameId === gameId);
    console.log('join: ' + gameId + ' ' + room);
    if(room == undefined){
      client.emit('gameRoom', {roomExists:false});
      return;
    }
    room.joinGame(client);
  }
  function exitGame(gameInstance, client){
    activeGameRooms = [
      ...activeGameRooms.filter(item => item.gameId !== gameInstance.gameId)
    ];
    activeGameRooms.forEach(x=>console.log(x.gameId));
    placeInLobby(client);
  }
  function placeInLobby(client){
    lobbyObject.addClient(client);
  }
  return placeInGameFunction;
};