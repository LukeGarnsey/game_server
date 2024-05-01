import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useConnectionState } from "../socketHandlers/socketConnect.js";
import { useParams } from 'react-router-dom';
import GameCanvas from '../game/GameCanvas.jsx';


export default function Game(){
  const {isConnected, handleConnect, setIsConnected, socketConnect} = useConnectionState(()=>{
      if(paramGameId !== undefined){
        socket.emit('joinRoom', {
          gameId:paramGameId
        });
      }
  });
  const {paramGameId} = useParams();
  const [isRoom, setIsRoom] = useState(false);
  
  useEffect(()=>{
    
    function onDisconnect(){
      setIsConnected(false);
    }

    function gameOver(){
      console.log("Game Over");
      noRoom();
    }
    function gameMessage({msg}){
      console.log(msg);
    }
    function gameRoom({roomExists}){
      console.log('Is Room: ' + roomExists);
      setIsRoom(roomExists);
      if(!roomExists)
        noRoom();
    }
    function noRoom(){
      let newHref = window.location.href;
      if(paramGameId !== undefined)
        newHref = newHref.replace(paramGameId, '');
      window.location.href = newHref;
    }
    if(!isConnected)
      socketConnect();

    socket.on('connect', handleConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('gameOver', gameOver);
    socket.on('gameMessage', gameMessage);
    socket.on('gameRoom', gameRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('gameOver', gameOver);
      socket.off('gameMessage', gameMessage);
      socket.off('gameRoom', gameRoom);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function ready(){
    socket.emit('ready', {

    });
  }
  return (
    <>
    {isConnected && isRoom ? (
        <>
          <div style={styles.container}>
            <h1>In Game</h1>
            
            <button onClick={ready}>Ready</button>

            
          </div>
          <GameCanvas />
        </>
      ) : (
        <h1>Connecting...</h1>
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