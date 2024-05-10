import { useState } from "react";
import { socket } from "../socket";

export function UseUsername(){
  const [username, setUsername] = useState("");
  const setAndEmitName = (name)=>{
    setUsername(name);
    socket.emit("addUsername", {name:name});
  }
  return {username, setAndEmitName, setUsername};
}