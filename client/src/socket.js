import {io} from 'socket.io-client';
import './env';

export const socket = io(window.REACT_APP_SERVER_URL, {
  autoConnect:false
});