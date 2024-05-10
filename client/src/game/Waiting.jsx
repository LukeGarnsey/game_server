import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { socket } from "../socket";
// import { UseUsername } from "../socketHandlers/username";

export default function Waiting({gameStartCallback}){
  const [readyState, setReadyState] = useState({playersReady:0,
  playerCount:0, state:'unready'});

  useEffect(()=>{
    function gameReady({playersReady, playerCount, state}){
      console.log('game ready stuff: ');
      setReadyState({
        playersReady,
        playerCount,
        state
      });
    }
    function gameStart(){
      gameStartCallback();
    }
    socket.on('ready', gameReady);
    socket.on('gameStart', gameStart);
    return () =>{
      socket.off('ready', gameReady);
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
      {readyState.state === 'unready' && (
        <button onClick={ready}>Ready</button>
      )}
      {readyState.state === 'ready' && (
        <button onClick={unReady}>UnReady</button>
      )}
      <div>
        <h2>Players Ready: {readyState.playersReady}</h2>
        <h2>Players: {readyState.playerCount}</h2>
      </div>
    </>
  );
}

Waiting.propTypes = {
  gameStartCallback:PropTypes.func
}