import { socket } from '../socket';
import { useEffect, useState } from 'react';
import ConnectionState from '../components/ConnectionState';
import Events from '../components/Events';
import ConnectionManager from '../components/ConnectionManager';
import Connect from '../components/chat/Connect';
import UserList from '../components/chat/UserList';
import RoomList from '../components/chat/RoomList';
import NewRoom from '../components/chat/NewRoom';
import ChatWindow from '../components/chat/ChatWindow';
import ChatTextEntry from '../components/chat/ChatTextEntry';

export default function ChatManager(){
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);

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
      setMessages(previous => [...previous, data]);
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
      if(myRoom.inRoom){
        console.log('LEFT MESSAGE');
        setMessages(previous => [...previous, {name:"Admin-room-l", text:myRoom.roomName}]);
      }
      setMyRoom(prevState =>({
        ...prevState,
        inRoom:success,
        roomName: roomName,
      }));
      setMessages(previous => [...previous, {name:"Admin-room", text:roomName}])
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
  function consumeMessage(){
    if(messages.length == 0)
      return undefined;
    
    const newMessage = messages.shift();
    setMessages(messages);
    return newMessage;
  }
  
  return (
    <>
      {isConnected ? (
        <div style={styles.mainContainer}>
          <div style={{...styles.container, ...styles.roomContainer}}>
            <NewRoom/>
            <RoomList room={myRoom} list={roomList} />
          </div>
          <div style={styles.container}>
            <ChatWindow room={myRoom} messages={messages} consumeMessage={consumeMessage}/>
          {myRoom.inRoom && 
            <ChatTextEntry username={username}/>
          }
          </div>
          
          <div style={{...styles.container, ...styles.userListContainer}}>
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

const styles = {
  mainContainer : {
    display:'flex',
    flexWrap:'noWrap'
  },
  container : {
    flexGrow: '3',
    margin: '5px',
    border: '1px solid black'
  },
  roomContainer:{
    flexGrow: '2'
  },
  userListContainer:{
    flexGrow: '1'
  }
}