
import { Outlet } from 'react-router-dom';
import './tailwind.css';
import FlashGame from './game/FlashGame';

function App() {

  return (
    <>
      <div className='group/spotlight relative'>
        <div className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0'>
          
            {/* <Outlet/> */}
          <div className='lg:flex lg:justify-between lg:gap-4'>
           
              <FlashGame />
           
          </div>
        </div>
      </div>
    </>
  )
}

export default App
