import { useRef } from "react";
import { socket } from "../../socket";
import PropTypes from 'prop-types';
export default function Lobby({roomList}){
  const roomNameRef = useRef(null);
  
  // const joinRoom = (roomName) => {
  //   socket.emit('enterRoom', {
  //     room:roomName
  //   });
  // }
  const enterRoom = (e) =>{
    e.preventDefault();
    if(roomNameRef.current.value){
      socket.emit('enterRoom', {
        room: roomNameRef.current.value
      });
    }
  }
  return (
    <>
      <h1 style={styles.h1}>Lobby</h1>
      <div style={styles.container}>
        
        <div style={styles.form}>
          {/* <ul>
            { roomList.map((room, index) => (
              <li key={index}><button onClick={() => joinRoom(room)}>{room}</button></li>
            ))}
          </ul> */}
          <hr></hr>
          <form className="form-join" onSubmit={enterRoom}>
            <input ref={roomNameRef} style={styles.formInput} type="text" id="room" placeholder="Chat room" size="5" required />
            <button style={styles.formButton} id="form-join" type="submit">Join</button>
          </form>
        </div>
        
      </div>
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
    maxWidth: '300px',
    minWidth: '40%',
    display: 'block',
    paddingBottom: '50px'
  },
  formInput:{
    height:'30px',
    width:'95%'
  },
  formButton:{
    display:'block',
    float:'right',
    marginTop: '10px'
  },
  div:{

  }
}

Lobby.propTypes = {
  roomList: PropTypes.array
}