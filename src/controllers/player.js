export default class PlayerController {
    constructor (scene, playerSprite) {
        this.player = playerSprite;
        this.scene = scene;
        this.velocity = 0;
        this.isMoving = 0;
        this.isRotating = 0;

        let ee = scene.events;
        ee.on('pressUp',      this.onPressUp,     this);
        ee.on('releaseUp',    this.onReleaseUp,   this);
        ee.on('pressDown',    this.onPressDown,   this);
        ee.on('releaseDown',  this.onReleaseDown, this);
        ee.on('pressLeft',    this.onPressLeft,   this);
        ee.on('releaseLeft',  this.onReleaseLeft, this);
        ee.on('pressRight',   this.onPressRight,  this);
        ee.on('releaseRight', this.onReleaseRight,this);
    }

    onPressUp() {
        this.velocity = 200;
        this.isMoving = 1;
    }

    onReleaseUp() {
        this.velocity = 0;
        this.isMoving = 0;
    }

    onPressDown() {
        this.velocity = -200;
        this.isMoving = -1;
    }

    onReleaseDown() {
        this.velocity = 0;
        this.isMoving = 0;
    }

    onPressLeft() {
        this.player.body.angularVelocity = -150;
        this.isRotating = -1;
    }

    onReleaseLeft() {
        this.player.body.angularVelocity = 0;
        this.isRotating = 0;
    }

    onPressRight() {
        this.player.body.angularVelocity = 150;
        this.isRotating = 1;
    }

    onReleaseRight() {
        this.player.body.angularVelocity = 0;
        this.isRotating = 0;
    }

    update() {
        this.player.setVelocity(Math.sin(this.player.rotation) * this.velocity, Math.cos(this.player.rotation) * -this.velocity);
    }
}
