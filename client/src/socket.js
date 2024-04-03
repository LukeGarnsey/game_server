import {io} from 'socket.io-client';

const URL = 'http://localhost:3001'; //process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect:false
});