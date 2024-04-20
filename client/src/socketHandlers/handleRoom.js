export function handleJoinedRoom(setMessages, setMyRoom, myRoom){
  return ({success, roomName}) =>{
    if(myRoom.inRoom){
      setMessages(previous => [...previous, {name:"Admin-room-l", text:myRoom.roomName}]);
    }
    setMyRoom(prevState =>({
      ...prevState,
      inRoom:success,
      roomName: roomName,
    }));
    setMessages(previous => [...previous, {name:"Admin-room", text:roomName}]);
  };
}

export function handleRoomUserList(setMyRoom){
  return ({users})=>{
    setMyRoom(prevState =>({
      ...prevState,
      users:users
    }));
  }
}

export function handleRoomList(setRoomList){
  return ({rooms})=>{
    setRoomList(rooms);
  }
}

export function handleMessage(setMessages){
  return (data) => {
    setMessages(previous => [...previous, data]);
  }
}