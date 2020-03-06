// The Keyboard Controller is concerned capturing Keyboard events
export default class KeyBoardController {
    constructor (scene) {
        this.scene = scene;
        let upObj = scene.input.keyboard.addKey('UP');
        upObj.on ('down', (event) => { scene.events.emit('pressUp');  });
        upObj.on ('up',   (event) => { scene.events.emit('releaseUp');    });
        let downObj = scene.input.keyboard.addKey('DOWN');
        downObj.on('down', (event) => { scene.events.emit('pressDown'); });
        downObj.on('up',   (event) => { scene.events.emit('releaseDown');   });
        let leftObj = scene.input.keyboard.addKey('LEFT');
        leftObj.on ('down', (event) => { scene.events.emit('pressLeft');  });
        leftObj.on ('up',   (event) => { scene.events.emit('releaseLeft');    });
        let rightObj = scene.input.keyboard.addKey('RIGHT');
        rightObj.on('down', (event) => { scene.events.emit('pressRight'); });
        rightObj.on('up',   (event) => { scene.events.emit('releaseRight');   });
        //let spaceObj = scene.input.keyboard.addKey('SPACE');
        //spaceObj.on('down', (event) => { scene.events.emit('downFire'); });
        //spaceObj.on('up',   (event) => { scene.events.emit('upFire');   });
    }
}
