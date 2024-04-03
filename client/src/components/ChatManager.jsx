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
    users:[]
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
    function showUsers({users}){
      console.log(users);
      setMyRoom(prevState =>({
        ...prevState,
        users:users
      }));
    }
    function showRooms({rooms}){
      setRoomList(rooms);
    }
    function joinedRoom({success, roomName}){
      console.log("joined: " + success + " " + roomName);
      setMyRoom(prevState =>({
        ...prevState,
        inRoom:success,
        roomName: roomName,
      }));
      console.log(myRoom);
    }
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('joinedRoom', joinedRoom);
    socket.on('foo', onFooEvent);
    socket.on('userList', showUsers);
    socket.on('roomsList', showRooms);
    socket.on('message', message);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('joinedRoom', joinedRoom);
      socket.off('foo', onFooEvent);
      socket.off('userList', showUsers);
      socket.off('roomsList', showRooms);
      socket.off('message', message)
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