import { useState } from "react";
import { socket } from "../socket";
export function useConnectionState(onConnect){
  const [isConnected, setIsConnected] = useState(socket.connected);
  const socketConnect = () =>{
    socket.connect();
  };
  const handleConnect = ()=>{
    setIsConnected(true);
    onConnect();
  };
  return {isConnected, handleConnect, setIsConnected, socketConnect};
}