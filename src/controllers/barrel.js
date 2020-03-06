export default class Barrel {
    constructor (scene, barrel) {
        scene.input.on('pointermove', function (pointer) {
            barrel.rotation = Phaser.Math.Angle.Between(barrel.x, barrel.y, pointer.x, pointer.y) + (3.14159/2);
        }, this);
    }
}
