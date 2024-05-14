import PropTypes from 'prop-types';
Questions.propTypes = {
  myQuestion: PropTypes.object,
  submitAnswer: PropTypes.func
}
export default function Questions({myQuestion, submitAnswer}){

  return ( 
    <>
      <h1>{myQuestion.question}</h1>
      {myQuestion.answers.map((answer, index)=> (
        <div key={index}>
          <button onClick={()=>submitAnswer(myQuestion.indices[index])}>{answer}</button>
        </div>
      ))}
    </>
  );
}