import { useEffect } from 'react';
import { socket } from '../socket';
import { useConnectionState } from "../socketHandlers/socketChatEvents";


export default function Game(){
  const {isConnected, handleConnect, setIsConnected, socketConnect} = useConnectionState();
  
  useEffect(()=>{
    
    function onDisconnect(){
      setIsConnected(false);
    }
    function welcome({msg}){
      console.log("message: " + msg);
    }
    function gameTime({gameTime}){
      console.log("gameTime: " + gameTime);
    }
    function gameOver(){
      console.log("Game Over");
    }
    function searching({msg}){
      console.log(msg);
    }
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('welcome', welcome);
    socket.on('gameTime', gameTime);
    socket.on('gameOver', gameOver);
    socket.on('searching', searching);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('welcome', welcome);
      socket.off('gameTime', gameTime);
      socket.off('gameOver', gameOver);
      socket.off('searching', searching);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function connect(){
    socketConnect();
  }
  function join(){
    socket.emit('search', {

    })
  }
  return (
    <>
    {isConnected ? (
        <div style={styles.container}>
          <h1>In Lobby</h1>
          <button onClick={join}>Join Game</button>
        </div>
      ) : (
        <button id="connect" onClick={connect}>Connect</button>
      )}
    </>
  )
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