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
        this.player.setVelocity(Math.sin(this.player.rotation) * 200, Math.cos(this.player.rotation) * -200);
    }

    onReleaseUp() {
        this.player.setVelocity(0, 0);
    }

    onPressLeft() {
        this.player.body.angularVelocity = -150;
    }

    onReleaseLeft() {
        this.player.body.angularVelocity = 0;
    }

    onPressRight() {
        this.player.body.angularVelocity = 150;
    }

    onReleaseRight() {
        this.player.body.angularVelocity = 0;
    }
}
