import * as PIXI from './pixi.js'
import Wheel from "./wheel";

PIXI.utils.skipHello()
const app = new PIXI.Application({
    width: 800,
    height: 800,
    antialias: true,
    transparent: true
});
document.body.appendChild(app.view);
// load the texture we need
app.loader.load((loader, resources) => {

    let button = PIXI.Sprite.from('assets/button.svg')
    button.width = 100
    button.height = 50
    button.interactive = true
    button.buttonMode = true
    button.on('click', () => app.stage.children[0].spin())

    app.stage.addChild(new Wheel(app, {
        radius: 300,
        slices: 10,
        winningCopy: 'GET 10% OFF',
        placeholderCopies: ['text1', 'text2', 'text3']
    }))
    app.stage.addChild(button)
    // Listen for frame updates
    app.ticker.add((delta) => {
        let wheel = app.stage.children[0]
        wheel.move(delta)
        // app.stage.children.forEach(child => child.children.forEach(child => child.rotation += 0.01))
    });
});
