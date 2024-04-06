import PropTypes from 'prop-types';
export default function ChatWindow({room}){

  return (
    <>
    <h2>{room.roomName}</h2>
      <ul className='chat-display'>
        <li className='post'>
          <div className='post-header'><span>Name</span></div>
          <div className='post-text'>This is post Text</div>
        </li>

        <li className='post'>
          <div className='post-header'><span>Name</span></div>
          <div className='post-text'>This is post Text</div>
        </li>
      </ul>
    </>
  );
}

ChatWindow.propTypes = {
  room:PropTypes.object.isRequired
}