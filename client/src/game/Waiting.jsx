import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { socket } from "../socket";
// import { UseUsername } from "../socketHandlers/username";

export default function Waiting({gameStartCallback}){
  const [roomState, setRoomState] = useState({clientObj:{
    name:'notSet',state:'unready',
  otherPlayers:[
  ]}, deckTitle:'', questionCount:0});

  useEffect(()=>{
    function roomState({clientObj, deckTitle, questionCount}){
      console.log('game ready stuff: ');
      setRoomState({
        clientObj,
        deckTitle,
        questionCount
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
      ready:roomState.clientObj.state === "unready"
    });
  }
  return (
    <>
    <div className="top-0 w-1/2 py-12 grid justify-center">
      <span>Quiz:</span>
      <h1 className="text-4xl font-bold tracking-tight text-slate-200 pb-2">{roomState.deckTitle}</h1>
      <h2 className="text-lg pb-2">questions: {roomState.questionCount}</h2>
      {/* <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">Players Ready: {roomState.clientObj.playersReady}</h2>
      <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">Players: {roomState.clientObj.playerCount}</h2> */}
        {/* {roomState.clientObj.state === 'unready' && (
          <button className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl" onClick={ready}>Ready</button>
        )}
        {roomState.clientObj.state === 'ready' && (
          <button className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl" onClick={unReady}>UnReady</button>
        )} */}
        <div className="bg-slate-800 my-2 pb-2 w-max">
        {/* <h2 className="m-2 text-xl font-medium text-slate-200 py-2">Players</h2> */}
          <ul className="m-4 w-max"> 
          
            <li className="bg-slate-600 group flex items-center p-2 border my-2">
              <p className="text-slate-200 font-medium w-max p-2" style={{width:'150px'}}>
                {roomState.clientObj.name}
              </p>
              <button onClick={ready} className={`items-center justify-center hover:text-slate-200 border border-blue-500 hover:border-teal-100 font-bold p-2 m-2 rounded-t rounded-b text-slate-900 ${roomState.clientObj.state == 'unready'?'bg-red-400':'bg-teal-400'}`} style={{width:'100px'}}>{
                roomState.clientObj.state === 'unready'?'Ready Up':'Wait'
              }</button>
            </li>
            { roomState.clientObj.otherPlayers.map((player, index) => (
              <li className="bg-slate-800 border border-slate-400 group flex items-center p-2 my-2" key={index}>
                <p className="text-slate-200 font-medium w-max p-2"   style={{width:'150px'}}>
                {player.name}
                </p>
                <h3 className={`text-slate-900 items-center justify-center font-bold p-2 m-2 rounded-full text-center ${player.state === 'unready'?'bg-red-600':'bg-teal-800'}`} style={{width:'100px'}}>{
                player.state === 'unready'?'...waiting...':'!Ready!'
                }</h3>
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