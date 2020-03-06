import config from '../config/game';

import SocketSession from '../networking/socket-session';
import PlayerSprite from '../sprites/player';
import BarrelSprite from '../sprites/tankBarrel';

import KeyBoardController from '../controllers/keyboard';
import PlayerController from '../controllers/player';
import BarrelController from '../controllers/barrel';

export default class PlayGameScene extends Phaser.Scene {
    constructor (config, key = 'PlayGame') {
        super({ key: key });
        this.playerID = null;
        this.userName = null;
        this.players = {};
    }


    init () {
        // Catch AppMessage Input
        this.game.appMessage = document.getElementById('app_message');
        this.game.appMessage.addEventListener('keypress', (e) => this.handleAppMessageKey(e));
        this.game.appMessage.style.display = 'block';
        // Catch ServerStatus
        this.game.serverStatus = document.getElementById('server_status');
        this.game.serverStatus.style.display = 'block';
    }

    create () {
        // initialize socket session with current scene for event emitters
        this.socketSession = new SocketSession(this);

        this.socketSession.connect();

        this.createMap();

        this.physics.world.setBoundsCollision(true, true, true, true);
        this.createPlayer();
        this.keyboardsniffer = new KeyBoardController(this);

        this.events.on('server-yourID', (playerID) => {
            console.log('yourID:', playerID);
            this.playerID = playerID;
            if (this.userName) {
                let prev = this.userName;
                delete this.userName;
                this.appendServerStatus('You have been disconnected by the server.');
                this.socketSession.send('doLogin', prev);
            }
        });

        this.events.on('server-yourUserName', (userName) => {
            console.log('Server Logged In With:', userName);
            this.userName = userName;
            this.appendServerStatus('You are logged in as: ' + userName);
        });

        this.events.on('server-serverReport', (line) => {
            console.log('SERVER: ' + line);
            this.appendServerStatus(line);
        });

        this.events.on('server-disconnected', () => {
            console.log('WEBSOCKET SERVER TERMINATED CONNECTION!');
        });

        this.events.on('server-createPlayer', (userName) => {
            console.log('WEBSOCKET SERVER CREATE PLAYER!');
            this.players[userName] = { userName: userName };
        });

        this.events.on('server-deletePlayer', (userName) => {
            console.log('WEBSOCKET SERVER DELETE PLAYER!');
            delete this.players[userName];
        });

        this.events.on('server-players', (players) => {
            console.log('WEBSOCKET SERVER PLAYERS!');
            let newPlayers = {};
            players.forEach(element => newPlayers[element.userName] = element);
            this.players = players;
        });
    }

    update () {
        if(this.playerController){
            this.playerController.updateVelocity();
        }
    }

    handleAppMessageKey(e) {
        let message = this.game.appMessage.value;
        if (e == null)
            return;
        if (message == '')
            return;
        if (e.which == 13 || e.keyCode == 13 || e.charCode == 13) {
            console.log("COMMAND LINE: " + message);
            var contents = message.split(" ");
            this.game.appMessage.value = '';
            // Parse contents for commands
            if (contents[0] == '/login') {
                if (contents[1]) {
                    console.log("LOGIN AS USER: " + contents[1]);
                    this.socketSession.send('doLogin', contents[1]);
                    this.socketSession.send('getPlayers');
                }
            }
            else if (contents[0] == '/logout') {
                if (this.userName) {
                    console.log('LOGOUT!');
                    this.socketSession.send('doLogout');
                }
                else {
                    console.log('Not logged in.');
                }
            }
            else if (contents[0].substr(0,1) == '/') {
                console.log("Unknown command: " + contents[0]);
                this.game.appMessage.value = message;
            }
            else if (this.userName) {
                // Appears to be logged in so send message to server.
                console.log("MESSAGE: " + message);
                this.socketSession.send('sendMessage', message);
            }
            else {
                // Attempting to talk without being logged in.
                this.game.appMessage.value = message;
                this.appendServerStatus("You can't speak until after you /login");
            }
        }
    }

    appendServerStatus (message) {
        if (this.game.serverStatus.value != '') {
            this.game.serverStatus.value += '\n';
        }
        this.game.serverStatus.value = this.game.serverStatus.value + message;
        this.game.serverStatus.scrollTop = this.game.serverStatus.scrollHeight;
    }

    createPlayer () {
        let player = new PlayerSprite(this);
        let barrel = new BarrelSprite(this);

        this.add.existing(player);
        this.physics.add.existing(player);
        this.add.existing(barrel);
        this.physics.add.existing(barrel);

        this.playerController = new PlayerController(this, player);
        let barrelController = new BarrelController(this, barrel);

        this.cameras.main.startFollow(player);
    }

    createMap () {
        this.tilemap = this.make.tilemap({ key: config.map.key });

        this.tilesets = {};
        config.map.tilesets.forEach(tileset => {
            this.tilesets[tileset.key] = this.tilemap.addTilesetImage(tileset.key);
        });

        this.tileLayers = {};
        config.map.tileLayers.forEach(layer => {
            this.tileLayers[layer.name] = this.tilemap.createDynamicLayer(layer.name, this.tilesets[layer.tileset], 0, 0);

            if (layer.properties.lookForCollisions) {
                this.tilemap.setCollisionByProperty({collides: true}, true, true, this.tileLayers[layer.name]);
            }
        });

        let objectSet = _.find(this.cache.tilemap.get(config.map.key).data.tilesets, { name: "objects" }).tiles;
        let objectGroups = _.filter(this.cache.tilemap.get(config.map.key).data.layers, { type: 'objectgroup' });
        this.objects = [];
        objectGroups.forEach(layer => {
            layer.objects.forEach(object => {
                let spriteObject = this.physics.add.image(object.x, object.y, config.spriteAtlas.key, objectSet[object.id].type);
                spriteObject.setImmovable(true);
                this.objects.push(spriteObject);
            });
        });
    }
};
