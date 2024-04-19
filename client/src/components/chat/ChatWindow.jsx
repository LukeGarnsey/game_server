import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Post from './Post';
export default function ChatWindow({room, messages, consumeMessage}){
  const chatDisplayRef = useRef(null);
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    let newMessage;
    const newMessages = [];
    while((newMessage = consumeMessage()) !== undefined){
      newMessages.push(newMessage);
    }
    setPosts(prevState =>
      {
        if(prevState.length > 20)
          prevState.shift();
        return [...prevState, 
      ...newMessages.map((message) => <Post key={prevState.length} name={message.name} body={message.text}/>)]
      }
    );

  }, [messages]);
  useEffect(() => {
    if (chatDisplayRef.current) {
        chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [posts]);
  return (
    <>
    <div className='container' style={{height:'750px', overflowY:'auto'}} ref={chatDisplayRef}>
        <div className='chat-display' >
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