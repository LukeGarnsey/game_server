import { useEffect } from 'react';
import { socket } from '../socket';
import { useConnectionState } from "../socketHandlers/socketChatEvents";
import { useParams } from 'react-router-dom';


export default function Game(){
  const {isConnected, handleConnect, setIsConnected, socketConnect} = useConnectionState(()=>{
      if(paramGameId !== undefined){
        socket.emit('joinRoom', {
          gameId:paramGameId
        });
      }
  });
  const {paramGameId} = useParams();
  console.log(paramGameId);
  useEffect(()=>{
    
    function onDisconnect(){
      setIsConnected(false);
    }

    function gameOver(){
      console.log("Game Over");
    }
    function gameMessage({msg}){
      console.log(msg);
    }
    function gameRoom({gameId}){
      console.log('your gameroom: ' + gameId);
      if(!window.location.href.includes(gameId)){
        let newHref = window.location.href;
        if(paramGameId !== undefined)
          newHref = newHref.replace(paramGameId, '');
        window.location.href = newHref + gameId;
      }
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
    socket.on('noRoom', noRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('gameOver', gameOver);
      socket.off('gameMessage', gameMessage);
      socket.off('gameRoom', gameRoom);
      socket.off('noRoom', noRoom);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function ready(){
    socket.emit('ready', {

    });
  }
  return (
    <>
    {isConnected ? (
        <div style={styles.container}>
          <h1>In Game</h1>
          
          <button onClick={ready}>Ready</button>
        </div>
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