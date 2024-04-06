import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Post from './Post';
export default function ChatWindow({room, messages, consumeMessage}){
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
      const newMessage = consumeMessage();
      if(newMessage !== undefined){
        // console.log("create new message: " + newMessage.name + ": " + newMessage.text);
        setPosts(prevState => [...prevState, <Post key={prevState.length} name={newMessage.name} body={newMessage.text}/>])
      }
  }, [messages]);
  return (
    <>
    <h2>{room.roomName}</h2>
      <ul className='chat-display'>
        { posts.map((post, index) => (
          <li key={index}>
            {post}
          </li>
         ))}
      </ul>
    </>
  );
}
// const styles = {

// }

ChatWindow.propTypes = {
  room:PropTypes.object.isRequired,
  messages: PropTypes.array,
  consumeMessage: PropTypes.func
}