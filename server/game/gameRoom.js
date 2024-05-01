
module.exports = (io, clientsInGame, gameId, exitGame)=>{
  const {tickUpdateMS } = require("./util/constants");
  
  const game = {
    clients: require("./util/clients")(io),
    gameTimeSeconds:0,
    gameId, 
    state:'loading',
    playerCount: clientsInGame.length,
    joinGame: function(client){
      client.join(gameId);
      this.clients.addClient(client, 'loading');

      
      //Setup client listeners
      client.on('ready', ()=>{
        this.clients.setClientState(client, 'ready');
      });
      client.on('disconnect', ()=>{
        console.log('game disconnect');
        this.removeSocketListeners(client);
        this.clients.removeClient(client);
      });
        ////
      client.emit('gameRoom', {
        gameId
      });
    },
    removeSocketListeners: function(client){
      client.removeAllListeners('idle');
      client.removeAllListeners('search');
      client.removeAllListeners('placeInGame');
      client.removeAllListeners('disconnect');
    }
  };
  game.clients.pingCheck(5000, 'gameRoom');
  clientsInGame.forEach(client => {
      game.joinGame(client);
  });
  // const pingInterval = setInterval(()=>{
  //   console.log('ping INterval');
  //   game.clients.clients.forEach(client => {
  //     const check = io.sockets.sockets.get(client.id);
  //     if(check === undefined){
  //       console.log('found undefined socket');
  //       game.clients.removeClient(client);
  //     }
  //   });
  // }, 5000);
  const intervalId = setInterval(()=>{
    
    if(game.state === 'loading')
    {
      if(game.clients.getClientsWithState('ready').length === game.playerCount){
        game.state = 'ready';
        io.to(gameId).emit('gameMessage', {
          msg:'Starting Game!'
        });
      }else{
        io.to(gameId).emit('gameMessage', {
          msg:'waiting for players...'
        });
      }
      console.log('loading: '+game.clients.getClientsWithState('loading').length);
      return;
    }
    //game logic
    game.gameTimeSeconds += tickUpdateMS / 1000;

    io.to(gameId).emit('gameMessage', {
      msg:game.gameTimeSeconds
    });
    // console.log('in game: ' + game.clients.clients.length);

    if(game.gameTimeSeconds > 5)
    {
      io.to(gameId).emit('gameOver', {
        
      });
      console.log("end game");
      clearInterval(game.clients.pingCheckInterval);
      clearInterval(intervalId);
      game.clients.forEach(client => {
        game.clients.removeClient(client);
        exitGame(game, io.sockets.sockets.get(client.id));
      });
      
    }
  }, tickUpdateMS);
    

  return game;
};