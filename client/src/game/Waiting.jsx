import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { socket } from "../socket";
// import { UseUsername } from "../socketHandlers/username";

export default function Waiting({gameStartCallback}){
  const [roomState, setRoomState] = useState({clientObj:{playersReady:0,
  playerCount:0, state:'unready'}, deckTitle:''});

  useEffect(()=>{
    function roomState({clientObj, deckTitle}){
      console.log('game ready stuff: ');
      setRoomState({
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
  const players = ["pet", "PLayer2", "DANNIAL", "COLRGI"];
  return (
    <>
    <div className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">{roomState.deckTitle}</h1>
      <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">Players Ready: {roomState.clientObj.playersReady}</h2>
      <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">Players: {roomState.clientObj.playerCount}</h2>
        {roomState.clientObj.state === 'unready' && (
          <button className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl" onClick={ready}>Ready</button>
        )}
        {roomState.clientObj.state === 'ready' && (
          <button className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl" onClick={unReady}>UnReady</button>
        )}
        <div className="">
          <ul className="mt-16 w-max">
            { players.map((player, index) => (
              <li key={index}>
                <p className="group flex items-center py-3">
                  <span></span>
                  <span>{player}</span>
                </p>
              </li>
            ))}
            
          </ul>
        </div>
      </div>
    </>
  );
}

Waiting.propTypes = {
  gameStartCallback:PropTypes.func
}