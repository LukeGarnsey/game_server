import { useRef } from "react";
import { socket } from "../socket";
import PropTypes from 'prop-types';
export default function Lobby({roomList, userList}){
  const roomNameRef = useRef(null);
  const nameRef = useRef(null);
  const enterRoom = (e) =>{
    e.preventDefault();
    if(nameRef.current.value && roomNameRef.current.value){
      socket.emit('enterRoom', {
        name: nameRef.current.value,
        room: roomNameRef.current.value
      });
    }
  }
  return (
    <>
      <h1>Lobby</h1>
      <form style={styles.form} className="form-join" onSubmit={enterRoom}>
        <input ref={nameRef} style={styles.formInput} type="text" id="name" maxLength="8" placeholder="Your name" size="5" required />
        <input ref={roomNameRef} style={styles.formInput} type="text" id="room" placeholder="Chat room" size="5" required />
        <button id="form-join" type="submit">Join</button>
      </form>
      <ul>
        { roomList.map((room, index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </>
  );
}

const styles = {
  form : {
    width: '100%',
    margin: 'auto',
    maxWidth: '600px',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    gap: '.25rem'
  },
  formInput:{
    flexGrow:'1',
    maxWidth:'calc(80% - .25rem)'
  }
}

Lobby.propTypes = {
  roomList: PropTypes.array,
  userList: PropTypes.array
}