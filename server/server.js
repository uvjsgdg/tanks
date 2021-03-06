import express from 'express';
import http from 'http';
import io from 'socket.io';
import Game from './game';

class Server {
    constructor () {
        this.expressApp = express();

        this.httpServer = http.Server(this.expressApp);

        this.webSocketServer = io.listen(this.httpServer);

        this.game = new Game(this.webSocketServer);
    }

    initExpressApp () {
        this.expressApp.use(express.static(__dirname + '/public'));

        this.expressApp.get('/', (req, res) => {
            res.send({
                message: ''
            });
        });
    }

    initWebSocketServer () {
        this.connections = {};

        this.webSocketServer.on('connection', (socket) => {
            let id = socket.conn.id;
            let clientData = {
                id: id,
                socket: socket,
            }
            console.log('[' + id + '] User connected!');

            this.connections[id] = clientData;

            socket.on('disconnect', () => {
                console.log('[' + id + '] User disconnected!');
                if (this.connections[id].userName) {
                    console.log('[' + id + '] DISCONNECT: ' + clientData.userName);
                    this.game.removeUser(clientData.userName);
                    delete this.connections[id];
                    socket.broadcast.emit('serverMessage', { action: 'deletePlayer', data: clientData.userName });
                }
                delete this.connections[id];
            });

            socket.on('sendMessage', (message) => {
                console.log('[' + id + '] sendMessage: ' + message);
                if (this.connections[id].userName) {
                    Object.values(this.connections).forEach((c) => {
                        if (c.userName) {
                            c.socket.emit('serverMessage', { action: 'serverReport', data: '[' + this.connections[id].userName + '] ' + message });
                        }
                    });
                }
                else {
                    socket.emit('serverMessage', { action: 'serverReport', data: 'ERROR! You first need to login using /login' });
                }
            });

            socket.on('sendMove', (data) => {
                console.log('[' + id + '] sendMove: ' + message);
                if (this.connections[id].userName) {
                    if(data.userName){
                        if(data.userName != clientData.userName){
                            socket.emit('serverMessage', { action: 'serverReport', data: 'ERROR! Sent move data for wrong user' });
                        }
                    }
                    else{
                        data.userName = clientData.userName;
                    }
                    clientData.moveData = data;
                    socket.broadcast.emit('serverMessage', { action: 'playerMove', data: data });
                }
                else {
                    socket.emit('serverMessage', { action: 'serverReport', data: 'ERROR! You first need to login using /login' });
                }
            });

            socket.on('sendAttack', (data) => {
                console.log('[' + id + '] sendAttack: ' + message);
                if (this.connections[id].userName) {
                    if(data.userName){
                        if(data.userName != clientData.userName){
                            socket.emit('serverMessage', { action: 'serverReport', data: 'ERROR! Sent attack data for wrong user' });
                        }
                    }
                    else{
                        data.userName = clientData.userName;
                    }
                    clientData.attackData = data;
                    socket.broadcast.emit('serverMessage', { action: 'reportAttack', data: data });
                }
                else {
                    socket.emit('serverMessage', { action: 'serverReport', data: 'ERROR! You first need to login using /login' });
                }
            });

            socket.on('doLogin', (userName) => {
                console.log('[' + id + '] doLogin: ' + userName);
                if (!userName || userName == null || userName == undefined)
                    return;
                if (this.connections[id].userName) {
                    console.log('[' + this.connections[id].userName + '] Ignoring relogin attempt as ' + userName);
                    socket.emit('serverMessage', { action: 'serverReport', data: 'You are already logged in as ' + this.connections[id].userName });
                }
                else {
                    let taken = 0;
                    Object.values(this.connections).forEach((c) => {
                        if (c.userName &&
                            c.userName == userName) {
                            taken = 1;
                        }
                    });
                    if (taken) {
                        socket.emit('serverMessage', { action: 'serverReport', data: 'Sorry, that username is already taken' });
                    }
                    else {
                        Object.values(this.connections).forEach((c) => {
                            if (c.userName) {
                                c.socket.emit('serverReport', userName + ' just logged in! Welcome!');
                            }
                        });
                        clientData.userName = userName;
                        this.game.addUser(userName);
                        socket.emit('serverMessage', { action: 'yourUserName', data: userName });
                        socket.broadcast.emit('serverMessage', { action: 'createPlayer', data: userName });
                        console.log('[' + id + '] LOGGED IN AS [' + userName + ']');
                    }
                }
            });

            socket.on('getPlayers', () => {
                let players = [];
                Object.values(this.connections).forEach((c) => {
                    if (c.userName) {
                        if(c.moveData){
                            players.push(c.moveData);
                        }
                        else{
                            players.push({ userName: c.userName });
                        }
                    }
                });
                socket.emit('serverMessage', { action: 'players', data: players });
            });

            socket.on('doLogout', () => {
                if (this.connections[id].userName) {
                    console.log('[' + id + '] doLogout: ' + this.connections[id].userName);
                    socket.emit('serverMessage', { action: 'serverReport', data: this.connections[id].userName + ', you have been logged out!' });
                    this.game.removeUser(this.connections[id].userName);
                    clientData.userName = null;
                    delete this.connections[id].userName;
                }
                else {
                    console.log('[' + id + '] Ignoring logout attempt because not logged in!');
                    socket.emit('serverMessage', { action: 'serverReport', data: 'Sorry, you are not logged in.' });
                }
            });

            socket.emit('serverMessage', { action: 'yourID', data: id });
        });
    }

    startHTTPServer () {
        this.httpServer.listen(9000, () => {
            console.log(`Listening on ${this.httpServer.address().port}`);
        });
    }

    start () {
        this.initExpressApp();

        this.initWebSocketServer();

        this.startHTTPServer();
    }
}

export default Server;
