import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export default class SocketSession {
    constructor (scene) {
        this.meta = {
            uuid: uuidv4(),
            scene: scene
        };
    }

    // get our client UUID
    get uuid () { return this.meta.uuid; }

    // get our server assigned player id
    get playerID () { return this.meta.playerID; }

    // get our user set userName
    get userName () { return this.meta.userName; }

    // connect to server
    connect () {
        // connect to server
        let wsBase = 'ws://localhost:9000/';
        if (document.location.port < 1024) {
            // Privileged port should use itself for WebSocket
            wsBase = document.location.href;
        }
        console.log("USING WEBSOCKET: " + wsBase);
        this.socket = io(wsBase);

        // setup all listeners
        this.listenForMyID();
        this.listenForMyUserName();
        this.listenForServerReport();

        // send login
        this.send('doLogin', this.meta.uuid);
    }

    // disconnect from server
    disconnect () {
        this.send('doLogout', this.uuid);
    }

    // send communication to server
    send (method, data) {
        this.socket.emit(method, data);
    }

    // listen for yourID events from server
    listenForMyID () {
        this.socket.on('yourID', (playerID) => {
            console.log('yourID:', playerID);
            this.meta.playerID = playerID;
        });
    }

    // listen for yourUserName from server
    listenForMyUserName () {
        this.socket.on('yourUserName', (userName) => {
            console.log('yourUserName:', userName);
            this.meta.userName = userName;
        });
    }

    // listen for serverReport events from server
    listenForServerReport () {
        this.socket.on('serverReport', (line) => {
            console.log('SERVER: ' + line);
        });
    }
};
