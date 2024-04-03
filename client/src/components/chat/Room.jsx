import PropTypes from 'prop-types';
import { socket } from "../../socket";
export default function Room({room, roomList}){
  console.log(room);
  const leave = () =>{
    socket.emit('leaveRoom')
  }
  return (
    <>
      <h1>{room.roomName}</h1>
      <button id="leave-room" onClick={leave}>Leave Room</button>
      <ul>
        {room.users.map((user, index) => (<li key={index}>{user.name}</li>))}
      </ul>
      <h3>rooms</h3>
      <ul>
        { roomList.map((room, index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </>
  );
}

Room.propTypes = {
  room:PropTypes.object.isRequired,
  roomList:PropTypes.array.isRequired
}