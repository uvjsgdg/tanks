import SocketSession from '../networking/socket-session';
import KeyBoardController from '../controllers/keyboard';

export default class PlayGameScene extends Phaser.Scene {
    constructor (config, key = 'PlayGame') {
        super({ key: key });
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

    preload () {
        // load all the resources required for this scene before using them
        this.loadMap();
    }

    create () {
        // initialize socket session with current scene for event emitters
        this.socketSession = new SocketSession(this);

        this.socketSession.connect();

        this.createMap();

        this.physics.world.setBoundsCollision(true, true, true, true);
        this.createPlayer();
        this.createControllers();
        this.keyboardsniffer = new KeyBoardController(this);
    }

    update () {
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
                this.socket.emit('sendMessage', message);
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
    }

    createControllers () {
    }

    loadMap () {

    }

    createMap () {

    }
};
