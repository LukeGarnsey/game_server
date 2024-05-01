import { useState } from "react";
import { socket } from "../socket";

export function UseUsername(){
  const [username, setUsername] = useState("");
  const setAndEmitName = (name)=>{
    setUsername(name);
    socket.emit("addUsername", {name:name});
  }
  return {username, setAndEmitName, setUsername};
}
export function useConnectionState(onConnect){
  const [isConnected, setIsConnected] = useState(socket.connected);
  const socketConnect = () =>{
    socket.connect();
  };
  const handleConnect = ()=>{
    setIsConnected(true);
    onConnect();
  };
  return {isConnected, handleConnect, setIsConnected, socketConnect};
}

export function useMessages(){
  const [messages, setMessages] = useState([]);
  const consumeMessage = () => {
    if(messages.length == 0)
      return undefined;
    
    const newMessage = messages.shift();
    setMessages(messages);
    return newMessage;
  };
  const handleMessage = (data) => {
    setMessages(previous => [...previous, data]);
  };
  return{messages, handleMessage, setMessages, consumeMessage};
}

export function useRoom(){
  const myRoomDefaultObj = {
    inRoom:false,
    roomName:'',
    users:[],
    leaveRoom : () =>{
      socket.emit('leaveRoom');
      setMyRoom(prevState =>({
        ...prevState,
        inRoom: false
      }));
    }
  }
  const [myRoom, setMyRoom] = useState(myRoomDefaultObj);
 
  const handleJoinRoom = ({success, roomName}) =>{
    if(myRoom.inRoom){
      // setMessages(previous => [...previous, {name:"Admin-room-l", text:myRoom.roomName}]);
    }
    setMyRoom(prevState =>({
      ...prevState,
      inRoom:success,
      roomName: roomName,
    }));
    // setMessages(previous => [...previous, {name:"Admin-room", text:roomName}]);
  };
  const handleRoomUserList = ({users})=>{
    setMyRoom(prevState =>({
      ...prevState,
      users:users
    }));
  };
  
  return {myRoom, handleJoinRoom, setMyRoom, 
    myRoomDefaultObj, handleRoomUserList};
}

export function useLobby() {
  const [roomList, setRoomList] = useState({rooms:[], users:[]});
  const handleRoomList = ({rooms, users})=>{
    console.log({rooms, users});
    setRoomList({rooms, users});
  }
  return {roomList, setRoomList, handleRoomList};
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
