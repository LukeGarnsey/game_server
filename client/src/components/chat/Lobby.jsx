import { useRef } from "react";
import { socket } from "../../socket";
import PropTypes from 'prop-types';
export default function Lobby({roomList, userList, username}){
  const roomNameRef = useRef(null);
  
  const enterRoom = (e) =>{
    e.preventDefault();
    if(roomNameRef.current.value){
      socket.emit('enterRoom', {
        room: roomNameRef.current.value,
        name: username
      });
    }
  }
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.h1}>Lobby</h1><h3  style={styles.h1}>{username}</h3>
      </div>
      <form style={styles.form} className="form-join" onSubmit={enterRoom}>
        
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
  container:{
    display: 'flex',
    justifyContent: 'space-between'
  },
  h1:{
    alignSelf:'baseline'
  },
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
  userList: PropTypes.array,
  username: PropTypes.string.isRequired
}