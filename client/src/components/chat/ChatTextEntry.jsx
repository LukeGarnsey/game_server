import PropTypes from 'prop-types';
import { useRef } from 'react';
import { socket } from '../../socket';

export default function ChatTextEntry({username}){
  const messageRef = useRef(null);
  const onSubmit = (e) =>{
    e.preventDefault();
    socket.emit('message', {
      name: username,
      text: messageRef.current.value
    });
    messageRef.current.value = '';
  }
  return (
  <>
    <form className='form-msg' onSubmit={onSubmit}>
      <input style={styles.input} type='text' ref={messageRef} placeholder='Your message' required />
      <button style={styles.button} type='submit'><span>Send</span></button>
    </form>
  </>
  );
}
const styles = {
  input:{
    height:'30px',
    width:'80%'
  },
  button:{
    width:'15%',
    padding:'5px',
    margin:'5px',
    maxWidth:'65px',
    minWidth:'50px'
  }
}
ChatTextEntry.propTypes = {
  username:PropTypes.string.isRequired
}