// The Keyboard Controller is concerned capturing Keyboard events
export default class KeyBoardController {
    constructor (scene) {
        this.scene = scene;
        let upObj = scene.input.keyboard.addKey('UP');
        upObj.on ('down', (event) => { scene.events.emit('downUp');  });
        upObj.on ('up',   (event) => { scene.events.emit('upUp');    });
        let downObj = scene.input.keyboard.addKey('DOWN');
        downObj.on('down', (event) => { scene.events.emit('downDown'); });
        downObj.on('up',   (event) => { scene.events.emit('upDown');   });
        let leftObj = scene.input.keyboard.addKey('LEFT');
        leftObj.on ('down', (event) => { scene.events.emit('downLeft');  });
        leftObj.on ('up',   (event) => { scene.events.emit('upLeft');    });
        let rightObj = scene.input.keyboard.addKey('RIGHT');
        rightObj.on('down', (event) => { scene.events.emit('downRight'); });
        rightObj.on('up',   (event) => { scene.events.emit('upRight');   });
        //let spaceObj = scene.input.keyboard.addKey('SPACE');
        //spaceObj.on('down', (event) => { scene.events.emit('downFire'); });
        //spaceObj.on('up',   (event) => { scene.events.emit('upFire');   });
    }
}
