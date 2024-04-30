
module.exports = (io) => {
  const lobby = {
    io,
    clients: {
      clients:[],
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
        client.removeAllListeners('placeInGame');
        client.removeAllListeners('disconnect');
        this.setClients(
          this.clients.filter(c => c.id !== client.id)
        );
      }
    },
    addClient: function(client, placeInGame){
      this.clients.addClient(client);
      client.emit('welcome', {
        msg:'welcome'
      });
      client.on('placeInGame', ()=>{
        console.log('place in game');
        this.clients.removeClient(client);
        placeInGame(client);
      });
    
      client.on('disconnect', ()=>{
        this.clients.removeClient(client);
      });

      console.log('lobby size ' + this.clients.clients.length);
    }
  }

  return lobby;
};
