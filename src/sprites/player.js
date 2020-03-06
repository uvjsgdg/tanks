import gameConfig from '../config/game.json';
import playerConfig from '../config/players.json';

export default class Player {
    constructor (scene, x = playerConfig.player.startingX, y = playerConfig.player.startingY) {
        super(scene, x, y, gameConfig.spriteAtlas.key, playerConfig.player.frame);

        this.controls = {
            target: scene.cursor,
        };

        this.config = playerConfig.player;
    }
}