import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import Questions from "./Question";
import TimerBar from "./util/TimerBar";

export default function FlashGame(){

  const [myState, setState] = useState('countdown');

  const [myQuestion, setQuestion] = useState({question:'', indices:[], answers:['', '', '', '', '']});

  const [endQuestion, setEndQuestion] = useState(true);
  const [answerIndex, setAnswer] = useState(null);

  const [myTimer, setTimer] = useState(5);
  const [timerBarWidthPercentage, setBar] = useState(1);

  // const [testQuestionIndex, testSetQuestionIndex] = useState(0);
  // const testQuestionIndexRef = useRef(testQuestionIndex);

  const timerRef = useRef(myTimer);
  const answerRef = useRef(answerIndex);
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
    function questionCall({question, indices, answers}){
      setQuestion({question, indices, answers});
      setEndQuestion(false);
      setAnswer(null);
      answerRef.current = null;

      const interval = setInterval(()=>{
        let time = timerRef.current;
        
        time -= .05;
        setTimer(time);
        timerRef.current = time;
  
        if(time <= 0 || answerRef.current !== null){
          console.log("ROUND is set to off");
          // time = 5;
          setEndQuestion(true);
          clearInterval(interval);
          const returnTimerInterval = setInterval(()=>{
            let time = timerRef.current;
            time += .15;
            setTimer(time);
            timerRef.current = time;
            if(time >= 5){
              setTimer(5);
              timerRef.current = time;
              clearInterval(returnTimerInterval);
            }
          }, 50);

          // console.log("Setting timeout");
          // setTimeout(()=>{
          //   let testIndex = testQuestionIndexRef.current;
          //   testIndex++;
          //   console.log(testIndex);
          //   if(testIndex >= testQuestions.length){
          //     gameMessage({msg:'GAme Over', state:'GameOver'});
          //     return;
          //   }
          //   testSetQuestionIndex(testIndex);
          //   testQuestionIndexRef.current = testIndex;
          //   questionCall(testQuestions[testIndex]);
          // }, 3000);

        }
      }, 50);
    }
    function timer({timer}){
      if(answerRef.current === null)
        setTimer(timer);
    }
    // const temp = setTimeout(() => {
    //   questionCall(testQuestions[testQuestionIndex]);
    // }, 1000);
    socket.on('gameMessage', gameMessage);
    socket.on('question', questionCall);
    socket.on('timer', timer);
    return () =>{
      socket.off('gameMessage', gameMessage);
      socket.off('question', questionCall);
      socket.off('timer', timer);
      // clearTimeout(temp);
    };
  }, []);
  const submitAnswer = (index) => {
    console.log('answer index: ' + index);
    setAnswer(index);
    answerRef.current = index;
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
          <TimerBar timerBarWidthPercentage={timerBarWidthPercentage}/>
        </div>
        <div className='w-1/2 flex justify-center items-center'>
          <hr className=""/>
        </div>
      </div>
      
        
        <Questions myQuestion={myQuestion} submitAnswer={submitAnswer} forceDismiss={endQuestion}/>

    </div>
    {/* )} */}
      
    </>
  );
}
const testQuestions = [
  {
    question:"Which type of beatle will only come out when the moon is also awake?",
    answers:["Graph Beatle", "Lady Bug Beattle", "Fountain Menace", "Black Swelt", "German Pincer"],
    indices:[1,2,0,3,4]
  },
  {
    question:"What time would be the correct time to wake up in the morning?",
    answers:["9am", "2pm", "11am", "9pm", "2am"],
    indices:[0,2,1,3,4]
  },
];