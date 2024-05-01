import { useEffect } from 'react';
import { socket } from '../socket';
import { useConnectionState } from "../socketHandlers/socketChatEvents";
import { useParams } from 'react-router-dom';


export default function Lobby(){
  const {isConnected, handleConnect, setIsConnected, socketConnect} = useConnectionState(()=>{});
  const {paramGameId} = useParams();
  console.log(paramGameId);
  useEffect(()=>{
    
    function onDisconnect(){
      setIsConnected(false);
    }
    function welcome({msg}){
      console.log("message: " + msg);
    //   if(paramGameId !== undefined){
    //     socket.emit('joinRoom', {
    //       gameId:paramGameId
    //     });
    //   }
    }
    function searching({msg}){
      console.log(msg);
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
    if(!isConnected)
        socketConnect();
      
    socket.on('connect', handleConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('welcome', welcome);
    socket.on('searching', searching);
    socket.on('gameMessage', gameMessage);
    socket.on('gameRoom', gameRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('welcome', welcome);
      socket.off('searching', searching);
      socket.off('gameMessage', gameMessage);
      socket.off('gameRoom', gameRoom);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function join(){
    socket.emit('placeInGame', {

    });
  }
  function search(){
    socket.emit('search', {

    });
  }
  function stopSearch(){
    socket.emit('idle', {

    });
  }
  return (
    <>
    {isConnected ? (
        <div style={styles.container}>
          <h1>In Lobby</h1>
          <button onClick={join}>Join Game</button>
          <button onClick={search}>Search</button>
          <button onClick={stopSearch}>StopSearch</button>
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