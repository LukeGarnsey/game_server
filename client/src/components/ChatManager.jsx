import { socket } from '../socket';
import { useEffect, useState } from 'react';
import ConnectionState from './ConnectionState';
import Events from './Events';
import ConnectionManager from './ConnectionManager';
import Lobby from '../pages/Lobby';
import Room from './chat/Room';

export default function ChatManager(){
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [myRoom, setMyRoom] = useState({
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
  });
  
  useEffect(()=>{
    function onConnect(){
      setIsConnected(true);
    }
    function onDisconnect(){
      setIsConnected(false);
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
  }, []);
  return (
    <>
      {myRoom.inRoom ? (
        <Room room={myRoom} roomList={roomList}/>
      ):(
        <Lobby roomList={roomList} userList={userList}/>
      )}
      
      <ConnectionState isConnected={isConnected}/>
      <Events events={ fooEvents}/>
      <ConnectionManager />
    </>
  );
}