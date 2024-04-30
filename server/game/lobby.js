
module.exports = (io) => {
  const lobby = {
    io,
    clients: {
      clients:[],
      setClients: function(newClientArray){
        this.clients = newClientArray;
      },
      getClient:function(id){
        return this.clients.find(item => item.id === id);
      },
      getClientsWithState:function(state){
        return this.clients.filter(item =>item.state===state);
      },
      setClientState:function(client, state){
        const newClient = {id:client.id, state:state};
        this.setClients([
          ...this.clients.filter(c => c.id !== newClient.id),
          newClient
        ]);
      },
      addClient:function(client){
        const newClient = {id:client.id, state:'idle'};
        this.setClients([
          ...this.clients.filter(c => c.id !== newClient.id),
          newClient
        ]);
      },
      removeClient:function(client){
        client.removeAllListeners('idle');
        client.removeAllListeners('search');
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
      client.on('idle', ()=>{
        
      });
      client.on('search', ()=>{
        console.log('search');
        this.clients.setClientState(this.clients.getClient(client.id), 'search');
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

  const intervalId = setInterval(()=>{
    const searching = lobby.clients.getClientsWithState('search');
    console.log('searching users count: ',searching.length);
    searching.forEach(item=>{
      const client = io.sockets.sockets.get(item.id);

      client.emit('searching', {msg:'you are searching'});
    });

  }, 1000);

  
  return lobby;
};
