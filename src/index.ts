import * as PIXI from 'pixi.js'
import Wheel from './wheel'
import { WheelOptions } from './types'

PIXI.utils.skipHello()
const app = new PIXI.Application({
    width: 800,
    height: 800,
    antialias: true,
    transparent: true,
})
document.body.appendChild(app.view)
// load the texture we need
app.loader.load(() => {
    const stage: PIXI.Container = app.stage

    const _addWheel = (name: string, options: WheelOptions) => {
        stage.addChild(new Wheel(app, name, options))
    }

    const _addButton = () => {
        const button = PIXI.Sprite.from('assets/button.svg')
        button.width = 100
        button.height = 50
        button.interactive = true
        button.buttonMode = true
        button.on('click', () => (<Wheel>stage.getChildAt(0)).spin())
        stage.addChild(button)
    }
    const _wheelName = 'wheel'
    const _wheelOptions = {
        radius: 300,
        slices: 12,
        winningCopy: 'GET 10% OFF',
        placeholderCopies: ['text1', 'text2', 'text3'],
    }

    _addWheel(_wheelName, _wheelOptions)
    _addButton()
    // _addSound()
    app.ticker.add((delta) => {
        const wheel = stage.getChildAt(0)
        if (wheel instanceof Wheel) wheel.move(delta)
        else console.warn(`wheel was a(n) ${typeof wheel}. ${JSON.stringify(wheel.name)}`)
    })
})