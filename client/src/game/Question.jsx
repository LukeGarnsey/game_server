import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './css/questionCSS.css'
Questions.propTypes = {
  myQuestion: PropTypes.shape({
    question: PropTypes.string.isRequired,
    indices: PropTypes.arrayOf(PropTypes.number).isRequired,
    answers: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  submitAnswer: PropTypes.func.isRequired,
  forceDismiss: PropTypes.bool.isRequired
}
export default function Questions({myQuestion, submitAnswer, forceDismiss}){
  const [clickedIndex, setClickedIndex] = useState(null);
  const [animateSelection, setAnimateSelection] = useState(false);
  const handleClick = (index) =>{
    if(forceDismiss){
      return;
    }
    setClickedIndex(index);
    submitAnswer(myQuestion.indices[index]);
    setTimeout(() => {
      setAnimateSelection(true);
    }, 250);
  };
  useEffect(()=>{
    if(forceDismiss){
      setAnimateSelection(true);
      setClickedIndex(-1);
    }else{
      setClickedIndex(null);
      setAnimateSelection(false);
    }
  }, [forceDismiss]);
  
  return ( 
    <>
      <div className='flex justify-between'>
        <div className={`top-0 max-h-screen w-1/2 py-24 question-container ${(animateSelection?'question':'')}`}>
          <h1 className={`text-4xl text-slate-200 w-full`}>{myQuestion.question}</h1>
        </div>
        <div className='group/list pt-24 w-1/2 py-24 place-self-center grid grid-cols-1 gap-4'>
          {myQuestion.answers.map((answer, index)=> (
            <div className={`place-self-center w-1/2 transition-transform duration-500 button-container ${
              (clickedIndex !== null && index !== clickedIndex ? 'dismis': 
              (animateSelection?'selected':''))
            }`} key={index} style={{
              zIndex:clickedIndex===index?10:1}}>
              <button className='bg-teal-800 text-slate-900 w-full flex items-center justify-center hover:text-slate-200 border border-blue-500 hover:border-teal-100 font-bold py-2 px-4 rounded-t rounded-b' onClick={()=>handleClick(index)} disabled={clickedIndex !== null}>{answer}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}