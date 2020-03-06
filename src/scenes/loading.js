// json imports
import gameConfig from '../config/game.json';

// web fonts
// import WebFont from 'webfontloader';
// require('../../assets/css/fonts.css');
// require('../../assets/fonts/[font].ttf');

// require in other assets to be included but not added to cache at this time
// require('../../assets/sounds/sound.wav');
// require('../../assets/json/tilemap.json');
// require('../../assets/images/tileset.png');
require('../../assets/json/map.json');
require('../../assets/json/spriteatlas.json');
require('../../assets/images/spriteatlas.png');
require('../../assets/images/landscape_tileset.png');
require('../../assets/images/play.png');

export default class LoadingScene extends Phaser.Scene {
    constructor (config, key = 'Loading') {
        super({ key: key });
    }

    init () {
        // font loading
        this.areFontsLoaded = true;
    }

    preload () {
        // load json configuration files
        // this.cache.json.add('assetsConfig', assetsConfig);

        // load web fonts
        /* WebFont.load({
            active: function () {
                this.webfontsLoaded();
            }.bind(this),
            custom: {
                families: ['font name'],
                urls: ['fonts.css']
            }
        }); */

        this.loadMap();
    }

    webfontsloaded () {
        this.areFontsLoaded = true;
    }

    update () {
        if (this.areFontsLoaded) {
            this.input.stopPropagation();
            this.scene.start('MainMenu');
        }
    }

    loadMap () {
        // load sprite atlas
        this.load.atlas(gameConfig.spriteAtlas.key, gameConfig.spriteAtlas.imageFile, gameConfig.spriteAtlas.jsonFile);

        // loading current level data
        this.load.tilemapTiledJSON(gameConfig.map.key, gameConfig.map.file);

        // load tilesets
        gameConfig.map.tilesets.forEach(tileset => {
            this.load.image(tileset.key, tileset.file);
        });        
    }
};
