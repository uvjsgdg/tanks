export default class PlayerController {
    constructor (scene, playerSprite) {
        this.player = playerSprite;
        this.scene = scene;

        let ee = scene.events;
        ee.on('pressUp',      this.onPressUp,    this);
        ee.on('releaseUp',    this.onReleaseUp,      this);
        ee.on('pressLeft',    this.onPressLeft,  this);
        ee.on('releaseLeft',  this.onReleaseLeft,    this);
        ee.on('pressRight',   this.onPressRight, this);
        ee.on('releaseRight', this.onReleaseRight,   this);
    }

    onPressUp() {
        this.player.setVelocity(0, 200);
    }

    onReleaseUp() {
        this.player.setVelocity(0, 0);
    }

    onPressLeft() {
        this.player.rotation += 0.2;
    }

    onReleaseLeft() {
        this.player.rotation = 0;
    }

    onPressRight() {
        this.player.rotation -= 0.2;
    }

    onReleaseRight() {
        this.player.rotation = 0;
    }
}
