export default class Barrel {
    constructor (scene, barrel) {
        scene.input.on('pointermove', function (pointer) {
            barrel.rotation = Phaser.Math.Angle.Between(barrel.x, barrel.y, pointer.x + scene.cameras.main.scrollX, pointer.y + scene.cameras.main.scrollY) + (Math.PI/2);
        }, this);
    }
}
