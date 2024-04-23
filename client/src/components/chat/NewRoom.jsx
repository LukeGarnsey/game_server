import { useRef } from "react";
import { socket } from "../../socket";

export default function NewRoom(){
  const roomNameRef = useRef(null);
  const enterRoom = (e) =>{
    e.preventDefault();
    if(roomNameRef.current.value){
      socket.emit('enterRoom', {
        room: roomNameRef.current.value
      });
      roomNameRef.current.value = '';
    }
  }
  return (
    <>
      <form className="form-join container" onSubmit={enterRoom}>
        <input ref={roomNameRef} style={styles.formInput} type="text" id="room" placeholder="New Channel" size="5" required />
        <button style={styles.formButton} id="form-join" type="submit">New Channel</button>
      </form>
    </>
  );
}

const styles = {
  formInput:{
    margin:'5px',
    height:'30px',
    width:'90%'
  },
  formButton:{
    margin:'5px',
    display:'block',
    marginTop: '10px'
  }
}