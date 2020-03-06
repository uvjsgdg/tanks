import SocketSession from '../networking/socket-session';
import PlayerSprite from '../sprites/player';

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
    }

    create () {
        // initialize socket session with current scene for event emitters
        this.socketSession = new SocketSession(this);

        this.socketSession.connect();

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
        }
    }

    createPlayer () {
        let player = new PlayerSprite(this);
        this.add.existing(player);
    }

    createControllers () {
    }
};
