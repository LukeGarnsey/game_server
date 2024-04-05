import { useRef } from "react";
import { socket } from "../../socket";

export default function NewRoom(){
  const roomNameRef = useRef(null);
  const enterRoom = (e) =>{
    e.preventDefault();
    if(roomNameRef.current.value){
      console.log("Join the room");
      socket.emit('enterRoom', {
        room: roomNameRef.current.value
      });
    }
  }
  return (
    <>
      <form className="form-join" onSubmit={enterRoom}>
        <input ref={roomNameRef} style={styles.formInput} type="text" id="room" placeholder="Chat room" size="5" required />
        <button style={styles.formButton} id="form-join" type="submit">Join</button>
      </form>
    </>
  );
}

const styles = {
  formInput:{
    height:'30px',
    width:'300px'
  },
  formButton:{
    display:'block',
    marginTop: '10px'
  }
}