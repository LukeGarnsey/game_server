import PropTypes from 'prop-types';
import { socket } from '../../socket';
export default function RoomList({room, list}){
  const joinRoom = (roomName) => {
    socket.emit('enterRoom', {
      room:roomName
    });
  }
  
  return (
  <div className='container' style={styles.cont}>
    <h4>Active Rooms:</h4>
    <div style={styles.startMargin}>
      { list.rooms.map((r, index) => {
        if(r === room.roomName){
          return <div style={styles.myRoom} key={index}><h3 style={styles.margin}>{r}</h3>
          <ul>
            {list.users[index].map((u, i) =>{
              return <li key={i + 's'}>{u.name}</li>
            })}
            </ul></div>
        }else{
          return <div style={styles.button} key={index}><button onClick={() => joinRoom(r)}>{r}</button>
            <ul>
            {list.users[index].map((u, i) =>{
              return <li key={i + 's'}>{u.name}</li>
            })}
            </ul>
          </div>
        }
      })}
    </div>
  </div>
  );
}

RoomList.propTypes = {
  room:PropTypes.object.isRequired,
  list: PropTypes.object
}

const styles = {
  cont:{
    width:'200px'
  },
  button:{
    paddingBottom:'10px',
    color:'grey',
    border: '2px solid black',
    padding: '10px'
  },
  myRoom:{
    color:'white',
    paddingBottom:'10px',
    border: '2px solid white',
    padding: '10px'
  },
  startMargin:{
    marginLeft:'15px'
  },
  margin:{
    margin:'5px'
  }
}