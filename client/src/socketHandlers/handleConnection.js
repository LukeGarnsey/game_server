export function handleConnect(setIsConnected){
  return ()=>{
    setIsConnected(true);
  };
}


export function handleDisonnect(setIsConnected, setUsername, setUserList, 
setRoomList, setMyRoom, myRoomDefaultObj){
  return ()=>{
    setIsConnected(false);
    setUsername("");
    setUserList([]);
    setRoomList([]);
    setMyRoom(myRoomDefaultObj);
  };
}