import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import Questions from "./Question";

export default function FlashGame(){

  const [myState, setState] = useState('countdown');

  const [myQuestion, setQuestion] = useState({question:'', indices:[], answers:[]});

  const [myTimer, setTimer] = useState(5);
  const [timerBarWidthPercentage, setBar] = useState(1);
  const timerRef = useRef(myTimer);
  useEffect(()=>{
    timerRef.current = myTimer;
    const widthPercentage = Math.min(Math.max(myTimer/5, 0), 1) * 100;
    setBar(widthPercentage);
  }, [myTimer]);

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
    const interval = setInterval(()=>{
      let time = timerRef.current;
      time -= .1;
      if(time <= 0)
        time = 5;
      
      setTimer(time);
      timerRef.current = time;
    }, 100);
    socket.on('gameMessage', gameMessage);
    socket.on('question', question);
    socket.on('timer', timer);
    return () =>{
      socket.off('gameMessage', gameMessage);
      socket.off('question', question);
      socket.off('timer', timer);
      clearInterval(interval);
    };
  }, []);
  function submitAnswer(index){
    console.log('answer index: ' + index);
    socket.emit('guess', {guess:index});
  }
  return (
    <>
    {/* {myState === 'countdown' && (
      <h2>Game starting</h2>
    )}
    {myState === 'game' && ( */}
    <div>
      <div className='flex justify-between items-center'>
        <div className='w-1/2'>
          <h2>{myTimer.toFixed(1)}</h2>
        </div>
        <div className='w-1/2 flex justify-center items-center'>
          <hr className=""/>
        </div>
      </div>
        <Questions myQuestion={testQuestion} submitAnswer={submitAnswer} />
        <div className="w-full bg-slate-300 h-4 rounded">
          <div className="bg-blue-500 h-4 rounded" style={{width: `${timerBarWidthPercentage}%`}}></div>
        </div>
    </div>
    {/* )} */}
      
    </>
  );
}
const testQuestion = {
  question:"Which type of beatle will only come out when the moon is also awake?",
  answers:["Graph Beatle", "Lady Bug Beattle", "Fountain Menace", "Black Swelt", "German Pincer"],
  indices:[1,2,0,3,4]
}