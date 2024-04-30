
module.exports = (io, clientsInGame, gameId, exitGame)=>{

  const game = {
    clients: {
      clients:clientsInGame,
      setClients: function(newClientArray){
        this.clients = newClientArray;
      },
      addClient:function(client){
        const newClient = {id:client.id};
        this.setClients([
          ...this.clients.filter(c => c.id !== newClient.id),
          newClient
        ]);
      },
      removeClient:function(client){
        this.setClients(
          this.clients.filter(c => c.id !== client.id)
        );
      }
    },
    gameTime:0,
    tickUpdate: 1000/10,
    gameId
  };

  clientsInGame.forEach(client => {
      client.join(gameId);
      //Setup client listeners
  });
  const secondTick = 1;
  const intervalId = setInterval(()=>{
    //game logic
    game.gameTime += game.tickUpdate;

    io.to(gameId).emit('gameTime', {
      gameTime:game.gameTime
    });

    if(game.gameTime / 1000 > 5)
    {
      io.to(gameId).emit('gameOver', {
        
      });
      console.log("end game");
      clearInterval(intervalId);
      clientsInGame.forEach(client => {
        exitGame(game, client);
      });
      
    }
  }, game.tickUpdate);
    

  return game;
};