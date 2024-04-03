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
  
    socket.emit('message', buildMsg(ADMIN, "Welcome to Chat Rooms App"));
    io.emit('roomsList', {
      rooms: getAllActiveRooms()
    });
    socket.on('leaveRoom', () =>{
      const user = getUser(socket.id);
      const currentRoom = user?.room;
      if(currentRoom){
        socket.leave(currentRoom);
        io.to(currentRoom).emit('message', buildMsg(ADMIN, `${user.name} has left the room`));
        clearUser(socket.id);
        const usersInRoom = getUsersInRoom(currentRoom);
        usersInRoom.forEach(user=>console.log(user));
        console.log("current: " + currentRoom);
        io.to(currentRoom).emit('userlist', {
          users:usersInRoom
        });
      }
    });
    socket.on('enterRoom', ({name, room}) =>{
      
      const currentRoom = getUser(socket.id)?.room;
      if(currentRoom){
        socket.leave(currentRoom);
        io.to(currentRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`));
        clearUser(socket.id);
        console.log("current: " + currentRoom);
        io.to(currentRoom).emit('userlist', {
          users:getUsersInRoom(currentRoom)
        });
      }

      const user = activateUser(socket.id, name, room);
  
      socket.join(user.room);
      
      socket.emit('joinedRoom', {success:true, roomName: room});
      socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room.`));
      //to everyone else
      socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`));
  
      //update user list form room
      io.to(user.room).emit('userList', {
        users: getUsersInRoom(user.room)
      });    
      io.emit('roomsList', {
        rooms: getAllActiveRooms()
      });
    });
  
    socket.on('disconnect', ()=>{
      const user = getUser(socket.id);
      userLeavesApp(socket.id);
  
      if(user){
        io.to(user.room).emit('message', buildMsg(ADMIN,`${user.name} has left the room`));
        io.to(user.room).emit('userList',{
          users:getUsersInRoom(user.room)
        });
        io.emit('roomList', {
          rooms:getAllActiveRooms()
        })
      }
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
  
  function activateUser(id, name, room){
    const user = {id, name, room};
    UsersState.setUsers([
      ...UsersState.users.filter(item=>item.id !== user.id),
      user
    ])
    return user;
  }
  function clearUser(id){
    const user = {id, name:undefined, room:undefined};
    UsersState.setUsers([
      ...UsersState.users.filter(item=>item.id !== id),
      user
    ])
    return user;
  }
  
  function userLeavesApp(id){
    UsersState.setUsers(
      UsersState.users.filter(user => user.id !== id)
    )
  }
  
  function getUser(id){
    return UsersState.users.find(user => user.id === id);
  }
  function getUsersInRoom(room){
    return UsersState.users.filter(user => user.room === room);
  }
  function getAllActiveRooms(){
    return Array.from(new Set(UsersState.users.map(user => user.room)));
  }
  function LeaveRoom(user, socket, io){
    
    if(user){
      const room = user.room;
      if(room){
        socket.leave(room);
        io.to(room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`));
      
        activateUser(user);
        io.to(room).emit('userlist', {
          users:getUsersInRoom(room)
        });
      }
    }
    
  }
};