import { useRef } from "react";
import PropTypes from 'prop-types';
export default function Connect({connect}){
  const nameRef = useRef(null);
  const submit = (e) =>{
    e.preventDefault();
    if(nameRef.current.value)
      connect(nameRef.current.value);
  };
  return (
    <>
    <h1>Your name:</h1>
    <form style={styles.form} className="form-join" onSubmit={submit}>
      <input ref={nameRef} style={styles.formInput} type="text" id="name" maxLength="8" placeholder="Your name" size="5" required />
      <button id="form-join" type="submit">Connect</button>
    </form>
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

Connect.propTypes = {
  connect: PropTypes.func.isRequired
}