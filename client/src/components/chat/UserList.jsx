import PropTypes from 'prop-types';

export default function UserList({list, username}){

  return (
    <>
      <div>
        <h4>users online</h4>
        <ul>
          <li><b>{username}</b></li>
          {list.filter(user=>user.name !== username).map((user, index)=>(
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

UserList.propTypes = {
  list: PropTypes.array,
  username: PropTypes.string.isRequired
}