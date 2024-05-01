import { useEffect, useRef } from 'react';

export default function GameCanvas(){
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const canvasRef = useRef(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gameLoop = () =>{
      
    };

    const intervalId = setInterval(gameLoop, 1000/60);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <canvas ref={canvasRef} width={800} height={600} />
  );
}