
module.exports = (io, clientsInGame, gameId, exitGame)=>{
  const {tickUpdateMS } = require("./util/constants");
  
  const game = {
    clients: require("./util/clients")(io),
    gameTimeSeconds:0,
    activeGame: {},
    gameId, 
    state:'loading',
    playerCount: clientsInGame.length,
    joinGame: function(client){
      const roomExists = game.state === 'loading';
      client.emit('gameRoom', {
        gameId,
        roomExists
      });
      if(!roomExists)
        return;

      client.join(gameId);
      this.clients.addClient(client, 'loading');

      
      //Setup client listeners
      client.on('ready', ({ready})=>{
        console.log('client ready');
        this.clients.setClientState(client, (ready)?'ready':'unready');
        const playersReady = game.clients.getClientsWithState('ready').length;
        this.clients.clients.forEach(client =>{
          const state = client.state;
          io.sockets.sockets.get(client.id).emit('ready', {
            playersReady,
            playerCount: game.clients.clients.length,
            state
          });
        });
      });
      client.on('disconnect', ()=>{
        console.log('game disconnect');
        this.removeSocketListeners(client);
        this.clients.removeClient(client);
      });
      
    },
    removeSocketListeners: function(client){
      client.removeAllListeners('idle');
      client.removeAllListeners('search');
      client.removeAllListeners('placeInGame');
      client.removeAllListeners('disconnect');
    },
    gameToRun: function(a){
      this.activeGame = a;
    },
    
  };
  game.clients.pingCheck(5000, 'gameRoom');
  clientsInGame.forEach(client => {
      game.joinGame(client);
  });
  const intervalId = setInterval(()=>{
    
    if(game.state === 'loading')
    {
      if(game.clients.getClientsWithState('ready').length > 0 && game.clients.getClientsWithState('ready').length >= game.clients.clients.length){
        game.state = 'ready';
        game.activeGame.startGame(gameId, game.clients, () =>{
          game.activeGame.closeGame(io, game.clients.clients);
          io.to(gameId).emit('gameOver', {
        
          });
          console.log("end game");
          clearInterval(game.clients.pingCheckInterval);
          clearInterval(intervalId);
          game.clients.clients.forEach(client => {
            game.clients.removeClient(client);
            exitGame(game, io.sockets.sockets.get(client.id));
          });
        });
        io.to(gameId).emit('gameStart', {});
      }else{
        io.to(gameId).emit('gameMessage', {
          msg:'waiting for players...'
        });
      }
      // console.log('loading: '+game.clients.getClientsWithState('loading').length);
      return;
    }
    if(game.activeGame.state === 'active'){
      game.activeGame.update(game.clients.clients, tickUpdateMS/1000);
    }
    
  }, tickUpdateMS);
    

  return game;
};