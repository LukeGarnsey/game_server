import { socket } from '../socket';
import { useLobby, UseUsername, useConnectionState, useMessages, useRoom } from '../socketHandlers/socketChatEvents';
import { useEffect } from 'react';
import ConnectionManager from '../components/ConnectionManager';
import Connect from '../components/chat/Connect';
import RoomList from '../components/chat/RoomList';
import NewRoom from '../components/chat/NewRoom';
import ChatWindow from '../components/chat/ChatWindow';
import ChatTextEntry from '../components/chat/ChatTextEntry';

export default function ChatManager(){
  const {isConnected, handleConnect, setIsConnected, socketConnect} = useConnectionState();

  const {roomList, setRoomList, handleRoomList} = useLobby();
  const {username, setAndEmitName, setUsername} = UseUsername();
  const {messages, handleMessage, consumeMessage} = useMessages();
  const {myRoom, handleJoinRoom, setMyRoom, myRoomDefaultObj, handleRoomUserList} = useRoom();

  
  useEffect(()=>{
    
    function onDisconnect(){
      setIsConnected(false);
      setUsername("");
      setRoomList({rooms:[], users:[]});
      setMyRoom(myRoomDefaultObj);
    }
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('joinedRoom', handleJoinRoom);
    socket.on('userListInRoom', handleRoomUserList);
    socket.on('roomsList', handleRoomList);
    socket.on('message', handleMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('joinedRoom', handleJoinRoom);
      socket.off('userListInRoom', handleRoomUserList);
      socket.off('roomsList', handleRoomList);
      socket.off('message', handleMessage);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function connect(name){
    socketConnect();
    setAndEmitName(name);
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
          
          {/* <div style={{...styles.container, ...styles.userListContainer}}>
            <UserList list={userList} username={username} myRoom={myRoom}/>
          </div> */}
        </div>
      ) : (
        <Connect connect={connect}/>
      )}
      
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
    flexGrow: '1'
  },
  userListContainer:{
    flexGrow: '1'
  }
}