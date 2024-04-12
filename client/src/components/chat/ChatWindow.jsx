import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Post from './Post';
export default function ChatWindow({room, messages, consumeMessage}){
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    let newMessage;
    const newMessages = [];
    while((newMessage = consumeMessage()) !== undefined){
      newMessages.push(newMessage);
    }
    setPosts(prevState => [...prevState, 
      ...newMessages.map((message) => <Post key={prevState.length} name={setName(message.name)} body={message.text}/>)]);
  }, [messages]);
  function setName(name){
    
    return name;
  }
  return (
    <>
    <div className='container'>
        <div className='chat-display'>
          { posts.map((post, index) => (
            <div key={index}>
              {post}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

ChatWindow.propTypes = {
  room:PropTypes.object,
  messages: PropTypes.array,
  consumeMessage: PropTypes.func
}