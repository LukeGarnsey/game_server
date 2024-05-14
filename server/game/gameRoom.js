
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
      this.clients.addClient(client, 'unready');
      const emitLobbyState = () => {
        this.clients.clients.forEach(c =>{
          const state = c.state;
          const otherClients = this.clients.clients.filter(item => item !== c);
          const otherPlayers = [...(this.clients.clients.filter(item => item !== c)
          .map((item, index) => {
            return{
              state: item.state,
              name: 'OtherName: '+index
            }
          }))];
          // {
          //   state: otherClients.map(item => item.state),
          //   name: otherClients.map(item => "Other Name")
          // }
          io.sockets.sockets.get(c.id).emit('roomState', {
            clientObj:{
              name:'My Name',
              state,
              otherPlayers
            },
            deckTitle:game.activeGame.deck.title,
            questionCount: game.activeGame.deck.cards.length
          });
        });
      };
      
      
      //Setup client listeners
      client.on('ready', ({ready})=>{
        console.log('client ready');
        this.clients.setClientState(client, (ready)?'ready':'unready');
        emitLobbyState();
      });
      client.on('disconnect', ()=>{
        console.log('game disconnect');
        this.removeSocketListeners(client);
        this.clients.removeClient(client);
        emitLobbyState();
      });
      setTimeout(()=>{
        emitLobbyState();
      }, 100);
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