import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export default class SocketSession {
    constructor () {
        this.meta = {
            uuid: uuidv4()
        };
    }

    get uuid () { return this.meta.uuid; }

    get playerID () { return this.meta.playerID; }

    get userName () { return this.meta.userName; }

    connect () {
        this.socket = io('http://localhost:9000/');

        this.listenForMyID();

        this.listenForMyUserName();
        
        this.listenForServerReport();

        this.socket.emit('doLogin', this.meta.uuid);
    }

    disconnect () {
        this.socket.emit('doLogout', this.uuid);
    }

    listenForMyID () {
        this.socket.on('yourID', (playerID) => {
            console.log('yourID:', playerID);
            this.meta.playerID = playerID;
        });
    }

    listenForMyUserName () {
        this.socket.on('yourUserName', (userName) => {
            console.log('yourUserName:', userName);
            this.meta.userName = userName;
        });
    }

    listenForServerReport () {
        this.socket.on('serverReport', (line) => {
            console.log('SERVER: ' + line);
        });
    }
};
