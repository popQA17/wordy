import io from "socket.io-client";
const ENDPOINT = 'https://api.wordy.popplays.tk'

const socket = io(ENDPOINT,{secure: true, rejectUnauthorized: false})
const socketDisconnect = () =>{
    socket.disconnect()
}

export { socket, socketDisconnect }

