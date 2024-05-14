import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { socket } from "../socket";
// import { UseUsername } from "../socketHandlers/username";

export default function Waiting({gameStartCallback}){
  const [readyState, setReadyState] = useState({clientObj:{playersReady:0,
  playerCount:0, state:'unready'}, deckTitle:''});

  useEffect(()=>{
    function roomState({clientObj, deckTitle}){
      console.log('game ready stuff: ');
      setReadyState({
        clientObj,
        deckTitle
      });
    }
    function gameStart(){
      gameStartCallback();
    }
    socket.on('roomState', roomState);
    socket.on('gameStart', gameStart);
    return () =>{
      socket.off('roomState', roomState);
      socket.off('gameStart', gameStart);
    };
  }, []);
  function ready(){
    socket.emit('ready', {
      ready:true
    });
  }
  function unReady(){
    socket.emit('ready', {ready:false});
  }
  return (
    <>
    <h1>{readyState.deckTitle}</h1>
      {readyState.clientObj.state === 'unready' && (
        <button onClick={ready}>Ready</button>
      )}
      {readyState.clientObj.state === 'ready' && (
        <button onClick={unReady}>UnReady</button>
      )}
      <div>
        <h2>Players Ready: {readyState.clientObj.playersReady}</h2>
        <h2>Players: {readyState.clientObj.playerCount}</h2>
      </div>
    </>
  );
}

Waiting.propTypes = {
  gameStartCallback:PropTypes.func
}