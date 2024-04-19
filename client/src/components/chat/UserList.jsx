import PropTypes from 'prop-types';

export default function UserList({list, username, myRoom}){

  return (
    <>
      <div className='container'>
        {myRoom.inRoom ?(
          <div>
            <h4>{myRoom.roomName}</h4>
            <ul>
              <li><b>{username}</b></li>
              {myRoom.users.filter(user=>user.name !== username).map((user, index)=>(
                <li key={index}>{user.name}</li>
              ))}
            </ul>

            <h4>users online</h4>
            <ul>
              {list.filter(user=> !myRoom.users.some(roomUser => roomUser.name === user.name)).map((user, index)=>(
                <li key={index}>{user.name}</li>
              ))}
            </ul>
          </div>
        ):(
          <div>
            <h4>users online</h4>
            <ul>
              <li><b>{username}</b></li>
              {list.filter(user=>user.name !== username).map((user, index)=>(
                <li key={index}>{user.name}</li>
              ))}
            </ul>
          </div>
        )}
        
      </div>
    </>
  );
}

UserList.propTypes = {
  list: PropTypes.array,
  username: PropTypes.string.isRequired,
  myRoom: PropTypes.object
}