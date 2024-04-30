module.exports = () => {
  return{ 
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
    }
  }
};