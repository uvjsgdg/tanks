import SocketSession from '../networking/socket-session';

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
        // Creates object for input with WASD kets
//        moveKeys = this.input.keyboard.addKeys({
//            'up': Phaser.Input.Keyboard.KeyCodes.W,
//            'down': Phaser.Input.Keyboard.KeyCodes.S,
//            'left': Phaser.Input.Keyboard.KeyCodes.A,
//            'right': Phaser.Input.Keyboard.KeyCodes.D
//        });
//
//        // Enables movement of player with WASD keys
//        this.input.keyboard.on('keydown_W', function (event) {
//            player.setAccelerationY(-800);
//        });
//        this.input.keyboard.on('keydown_S', function (event) {
//            player.setAccelerationY(800);
//        });
//        this.input.keyboard.on('keydown_A', function (event) {
//            player.setAccelerationX(-800);
//        });
//        this.input.keyboard.on('keydown_D', function (event) {
//            player.setAccelerationX(800);
//        });
//
//        // Stops player acceleration on uppress of WASD keys
//        this.input.keyboard.on('keyup_W', function (event) {
//            if (moveKeys['down'].isUp)
//                player.setAccelerationY(0);
//        });
//        this.input.keyboard.on('keyup_S', function (event) {
//            if (moveKeys['up'].isUp)
//                player.setAccelerationY(0);
//        });
//        this.input.keyboard.on('keyup_A', function (event) {
//            if (moveKeys['right'].isUp)
//                player.setAccelerationX(0);
//        });
//        this.input.keyboard.on('keyup_D', function (event) {
//            if (moveKeys['left'].isUp)
//                player.setAccelerationX(0);
//        });
    }

    create () {
        this.socketSession = new SocketSession();

        this.socketSession.connect();
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
};
