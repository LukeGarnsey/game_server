import PropTypes from 'prop-types';
import { socket } from '../../socket';
export default function RoomList({room, list}){
  const joinRoom = (roomName) => {
    socket.emit('enterRoom', {
      room:roomName
    });
  }
  
  return (
  <>
  <h4>Rooms:</h4>
    <ul>
      { list.map((r, index) => {
        console.log(r);
        if(r === room.roomName){
          return <li key={index}>{r}</li>
        }else{
          return <li key={index}><button onClick={() => joinRoom(r)}>{r}</button></li>
        }
      })}
    </ul>
  </>
  );
}

RoomList.propTypes = {
  room:PropTypes.object.isRequired,
  list: PropTypes.array
}