const {Server} = require("socket.io");

module.exports = (expressServer)=>{
  const ADMIN = "Admin";
  const UsersState = {
    users:[],
    setUsers: function(newUsersArray){
      this.users = newUsersArray
    }
  }
  const io = new Server(expressServer, {
    cors:{
      origin: process.env.NODE_ENV === "production"?false:['http://localhost:3000', 'http://127.0.0.1:3000']
    }
  });

  io.on('connection', socket =>{
    console.log(`User ${socket.id} connect`);
    addUserConnected(socket.id);
    socket.emit('message', buildMsg(ADMIN, "Welcome to Chat Rooms App"));
    io.emit('roomsList', {
      rooms: getAllActiveRooms()
    });

    socket.on('addUsername', ({name})=>{
      addUsername(socket.id, name);
      io.emit("allUsers", {
        users:getUsersOnline()
      });
    });

    socket.on('leaveRoom', () =>{
      const user = getUser(socket.id);
      const currentRoom = user?.room;
      if(currentRoom){
        socket.leave(currentRoom);
        io.to(currentRoom).emit('message', buildMsg(ADMIN, `${user.name} has left the room`));
        removeUserFromRoom(socket.id, io, currentRoom);
        io.emit('roomsList', {
          rooms: getAllActiveRooms()
        });
      }
    });
    socket.on('enterRoom', ({name, room}) =>{
      
      const currentRoom = getUser(socket.id)?.room;
      if(currentRoom){
        socket.leave(currentRoom);
        io.to(currentRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`));
        removeUserFromRoom(socket.id, io, currentRoom);
      }

      const user = activateUser(socket.id, name, room);
  
      socket.join(user.room);
      
      socket.emit('joinedRoom', {success:true, roomName: room});
      socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room.`));
      //to everyone else
      socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`));
  
      //update user list form room
      io.to(user.room).emit('userListInRoom', {
        users: getUsersInRoom(user.room)
      });    
      io.emit('roomsList', {
        rooms: getAllActiveRooms()
      });
    });
  
    socket.on('disconnect', ()=>{
      const user = getUser(socket.id);
      removeDisconnectedUser(socket.id);
      
      if(user){
        io.to(user.room).emit('message', buildMsg(ADMIN,`${user.name} has left the room`));
        io.to(user.room).emit('userListInRoom',{
          users:getUsersInRoom(user.room)
        });
        io.emit('roomsList', {
          rooms:getAllActiveRooms()
        })
      }
      
      io.emit("allUsers", {
        users:getUsersOnline()
      });
      console.log(`User ${socket.id} disconnect`);
    });
    socket.on('message', ({name, text}) =>{
      const room = getUser(socket.id)?.room;
      if(room){
        io.to(room).emit('message', buildMsg(name, text)); 
      }
    });
    socket.on('activity', ({name})=>{
      const room = getUser(socket.id)?.room;
      if(room){
        socket.broadcast.to(room).emit('activity', name);
      }
    });
  });
  
  function buildMsg(name, text){
    return {
      name,
      text,
      time: new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).format(new Date())
    };
  }

  function removeDisconnectedUser(id){
    UsersState.setUsers([
      ...UsersState.users.filter(user => user.id !== id)
    ]);
  }
  function addUserConnected(id){
    const newUser = {id};
    UsersState.setUsers([
      ...UsersState.users.filter(user => user.id !== id),
      newUser
    ]);
  }
  function addUsername(id, name){
    const newUser = {id, name};
    console.log("new User: " + newUser.name);
    UsersState.setUsers([
      ...UsersState.users.filter(user => user.id !== id),
      newUser
    ]);
  }
  function activateUser(id, name, room){
    const newUser = {id, name, room};
    UsersState.setUsers([
      ...UsersState.users.filter(user=>user.id !== id),
      newUser
    ])
    return newUser;
  }
  function removeUserFromRoom(id, io, currentRoom){
    const newUser = {id};
    UsersState.setUsers([
      ...UsersState.users.filter(user=>user.id !== id),
      newUser
    ]);
    io.to(currentRoom).emit('userListInRoom', {
      users:getUsersInRoom(currentRoom)
    });
    return newUser;
  }
  
  function getUser(id){
    return UsersState.users.find(user => user.id === id);
  }
  function getUsersOnline(){
    return UsersState.users.filter(user => user.name !== undefined);
  }
  function getUsersInRoom(room){
    return UsersState.users.filter(user => user.room === room);
  }
  function getAllActiveRooms(){
    return Array.from(new Set(UsersState.users.map(user => user.room)))
          .filter(room => room !== undefined);
  }
};