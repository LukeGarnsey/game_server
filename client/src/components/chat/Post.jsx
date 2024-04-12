import PropTypes from 'prop-types';

export default function Post({name, body}){
  if(name === 'Admin'){
    name = '##';
    body = body.toUpperCase();
  }
  else if(name === 'Admin-room'){
    name = '##';
    body = `##Joined ${body.toUpperCase()}`;
  }else if(name === 'Admin-room-l'){
    name = '##';
    body = `##---LEFT ${body.toUpperCase()} ---##`;
  }
  return (
    <div className='post' style={styles.box}>
      {name === '##' ? 
      <>
      <div className='post-text' style={styles.admin}>##{body}</div>
      </> 
      : 
      <>
        <div style={styles.header}><span><strong>{name}</strong></span></div>
        <div className='post-text' style={styles.padBody}>- {body}</div>
      </>
      }
      
    </div>
  );
}

Post.propTypes = {
  name:PropTypes.string.isRequired,
  body:PropTypes.string.isRequired
}

const styles = {
  box:{
    border: '1px solid black',
    padding: '5px',
    marginBottom: '5px'
  },
  header:{
    fontSize:'21px'
  },
  padBody:{
    paddingTop:'0px',
    paddingLeft:'10px',
    backgroundColor:'#141414'
  },
  admin:{
    backgroundColor:'#444444',
    padding:'2px'
  }
}