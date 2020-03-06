export default class Barrel {
    constructor (scene, barrel) {
        this.scene = scene;
        scene.input.on('pointermove', function (pointer) {
            barrel.rotation = Phaser.Math.Angle.Between(barrel.x, barrel.y, pointer.x + scene.cameras.main.scrollX, pointer.y + scene.cameras.main.scrollY) + (Math.PI/2);
        }, this);
    }

    update () {
        // Force barrel align with tank
        this.scene.mybarrel.x = this.scene.myplayer.x;
        this.scene.mybarrel.y = this.scene.myplayer.y;
    }
}
