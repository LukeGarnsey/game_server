import { socket } from '../socket';
import { useEffect, useState } from 'react';
import ConnectionState from '../components/ConnectionState';
import Events from '../components/Events';
import ConnectionManager from '../components/ConnectionManager';
import Lobby from '../components/chat/Lobby';
import Room from '../components/chat/Room';
import Connect from '../components/chat/Connect';
import UserList from '../components/chat/UserList';
import RoomList from '../components/chat/RoomList';
import NewRoom from '../components/chat/NewRoom';

export default function ChatManager(){
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [username, setUsername] = useState("");

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
  
  useEffect(()=>{
    if(username){
      socket.emit("addUsername", {name:username});
    }
  }, [username]);
  
  useEffect(()=>{
    function onConnect(){
      setIsConnected(true);
    }
    function onDisconnect(){
      setIsConnected(false);
      setUsername("");
      setUserList([]);
      setRoomList([]);
      setMyRoom(myRoomDefaultObj);
    }
    function onFooEvent(value){
      setFooEvents(previous => [...previous, value]);
    }
    function message(data){
      console.log(data);
    }
    function allUsers({users}){
      setUserList(users);
    }
    function userListInRoom({users}){
      setMyRoom(prevState =>({
        ...prevState,
        users:users
      }));
    }
    function roomsList({rooms}){
      console.log("rooms updated: " + rooms.length)
      setRoomList(rooms);
    }
    function joinedRoom({success, roomName}){
      setMyRoom(prevState =>({
        ...prevState,
        inRoom:success,
        roomName: roomName,
      }));
    }
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('joinedRoom', joinedRoom);
    socket.on('foo', onFooEvent);
    socket.on('userListInRoom', userListInRoom);
    socket.on('roomsList', roomsList);
    socket.on('message', message);
    socket.on('allUsers', allUsers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('joinedRoom', joinedRoom);
      socket.off('foo', onFooEvent);
      socket.off('userListInRoom', userListInRoom);
      socket.off('roomsList', roomsList);
      socket.off('message', message);
      socket.off('allUsers', allUsers);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function connect(name){
    setUsername(name);
    socket.connect();
  }
  function render(){
    // if(isConnected){
    if(myRoom.inRoom){
      return (<></>);
    }else{
      return (<Lobby roomList={roomList}/>);
    }
    // }else{
    //   return (<Connect connect={connect}/>);
    // }
  }
  
  return (
    <>
      {isConnected ? (
        <div>
          <div>
            <NewRoom/>
            <RoomList room={myRoom} list={roomList} />
          </div>
          {/* <Lobby roomList={roomList}/> */}
          {/* {render()} */}
          <div>
            <UserList list={userList} username={username} />
          </div>
        </div>
      ) : (
        <Connect connect={connect}/>
      )}
      
      <ConnectionState isConnected={isConnected}/>
      <Events events={ fooEvents}/>
      <ConnectionManager />
    </>
  );
}