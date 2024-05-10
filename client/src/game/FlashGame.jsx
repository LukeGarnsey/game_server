import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function FlashGame(){

  const [myState, setState] = useState('countdown');

  const [myQuestion, setQuestion] = useState({question:'', indices:[], answers:[]});

  const [myTimer, setTimer] = useState(0);

  useEffect(() =>{
    function gameMessage({state, msg}){
      setState(state);
      console.log(msg);
    }
    function question({question, indices, answers}){
      setQuestion({question, indices, answers});
    }
    function timer({timer}){
      setTimer(timer);
    }

    socket.on('gameMessage', gameMessage);
    socket.on('question', question);
    socket.on('timer', timer);
    return () =>{
      socket.off('gameMessage', gameMessage);
      socket.off('question', question);
      socket.off('timer', timer);
    };
  }, []);
  function submitAnswer(index){
    console.log('answer index: ' + index);
    socket.emit('guess', {guess:index});
  }
  return (
    <>
    {myState === 'countdown' && (
      <h2>Game starting</h2>
    )}
    {myState === 'game' && (
      <div>
        <h2>{5 - myTimer}</h2>
        <h1>{myQuestion.question}</h1>
      {myQuestion.answers.map((answer, index)=> (
        <div key={index}>
          <button onClick={()=>submitAnswer(myQuestion.indices[index])}>{answer}</button>
        </div>
      ))}
    </div>
    )}
      
    </>
  );
}