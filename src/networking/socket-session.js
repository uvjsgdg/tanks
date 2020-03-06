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

    // get our connect scene
    get scene () { return this.meta.scene; }

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
        this.listenForServerMessages();

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

    listenForServerMessages () {
        this.socket.on('serverMessage', (jsonEncodedString) => {
            let message = JSON.parse(jsonEncodedString);

            console.log('serverMessage:', message);

            this.scene.events.emit(`server-${message.action}`, message.data);
        });
    }
};
