
module.exports = (io, placeInGame, joinGame) => {
  const lobby = {
    io,
    clients:  require("./util/clients")(),
    addClient: function(client){
      this.clients.addClient(client, 'idle');
      client.emit('welcome', {
        msg:'welcome'
      });
      client.on('joinRoom', ({gameId})=>{
        console.log('client wants to join: '+gameId);
        joinGame(client, gameId)
      });
      client.on('idle', ()=>{
        if(this.clients.getClient(client.id).state !== 'idle'){
          this.clients.setClientState(this.clients.getClient(client.id), 'idle');
        }
        else
          console.log('already idle');
      });
      client.on('search', ()=>{
        if(this.clients.getClient(client.id).state !== 'search'){
          this.clients.setClientState(this.clients.getClient(client.id), 'search');
        }
        else
          console.log('already searching');
      });
      client.on('placeInGame', ()=>{
        this.removeSocketListeners(client);
        this.clients.removeClient(client);
        placeInGame([client]);
      });
    
      client.on('disconnect', ()=>{
        this.removeSocketListeners(client);
        this.clients.removeClient(client);
      });

      console.log('lobby size ' + this.clients.clients.length);
    },
    removeSocketListeners: function(client){
      client.removeAllListeners('idle');
      client.removeAllListeners('search');
      client.removeAllListeners('placeInGame');
      client.removeAllListeners('disconnect');
    }
  }

  const intervalId = setInterval(()=>{
    const searching = lobby.clients.getClientsWithState('search');
    console.log('searching users count: ',searching.length);
    searching.forEach((item, index)=>{
      const client = io.sockets.sockets.get(item.id);
      
      client.emit('searching', {msg:'you are searching'});
    });

    if(searching.length > 1){
      const clients = [];
      clients.push(io.sockets.sockets.get(searching[0].id));
      clients.push(io.sockets.sockets.get(searching[1].id));
      placeInGame(clients);
      clients.forEach(c =>{
        lobby.removeSocketListeners(c);
        lobby.clients.removeClient(c);
      });
    }

  }, 5000);

  
  return lobby;
};
