import PropTypes from 'prop-types';

export default function TimerBar({timerBarWidthPercentage}){

  return (
    <div className="w-full bg-slate-300 h-4 rounded">
    <div className={`${timerBarWidthPercentage>35?'bg-blue-500':'bg-red-600'} h-4 rounded`} style={{width: `${timerBarWidthPercentage}%`}}></div>
    </div>
  );
}

TimerBar.propTypes = {
  timerBarWidthPercentage: PropTypes.number.isRequired
}