import gameConfig from '../config/game.json';
import playerConfig from '../config/player.json';

export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x = playerConfig.player.startingX, y = playerConfig.player.startingY) {
        super(scene, x, y, gameConfig.spriteAtlas.key, playerConfig.player.frame);

        this.controls = {
            target: scene.cursor,
        };

        this.config = playerConfig.player;
    }
}
