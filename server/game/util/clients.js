module.exports = (io) => {
  return{ 
    io,
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
    addClient:function(client, state){
      const newClient = {id:client.id, state:state };
      this.setClients([
        ...this.clients.filter(c => c.id !== newClient.id),
        newClient
      ]);
    },
    removeClient:function(client){
      
      this.setClients(
        this.clients.filter(c => c.id !== client.id)
      );
    },
    pingCheckInterval:undefined,
    pingCheck:function(intervalTime, admin){
      this.pingCheckInterval = 
       setInterval(()=>{
        console.log(admin + 'ping INterval');
        this.clients.forEach(client => {
          const check = this.io.sockets.sockets.get(client.id);
          if(check === undefined){
            console.log(admin + 'found undefined socket');
            this.removeClient(client);
          }
        });
      }, intervalTime);
    }
  }
};