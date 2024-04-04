import { Link } from "react-router-dom";

export default function Home(){
  
  return(
    <>
    <h1>
      Welcome to Chat-App
    </h1>
    <button>
      <Link to={'/chat'}>Start Chatting</Link>
    </button>
    </>
  );
}

// const styles = {
//   form : {
//     width: '100%',
//     margin: 'auto',
//     maxWidth: '600px',
//     display: 'flex',
//     flexFlow: 'row wrap',
//     justifyContent: 'center',
//     gap: '.25rem'
//   },
//   formInput:{
//     flexGrow:'1',
//     maxWidth:'calc(80% - .25rem)'
//   }
// }