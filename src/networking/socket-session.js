import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export default class SocketSession {
    constructor (scene) {
        this.scene = scene;
        this.uuid = uuidv4();
    }

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
    }

    // send communication to server
    send (method, data) {
        this.socket.emit(method, data);
    }

    listenForServerMessages () {
        this.socket.on('serverMessage', (message) => {
            console.log('serverMessage:', message);

            this.scene.events.emit(`server-${message.action}`, message.data);
        });
        this.socket.on('disconnect', () => {
            console.log('WEBSOCKET SERVER TERMINATED CONNECTION!');
            scene.events.emit('server-disconnected', {});
        });
    }
};
