import * as PIXI from './pixi'
import palette from 'google-palette'
import 'fontsource-nunito-sans/400.css'
import WheelPortion from "./WheelSlice";

export default class Wheel extends PIXI.Container {
    constructor (app,
                 {
                     radius,
                     slices,
                     winningCopy,
                     placeholderCopies
                 }) {
        super()
        let colours = palette('tol-rainbow', slices)
        this.name = 'wheel'
        this.slices = []
        const angle = 360 / slices
        this.winningSliceIndex = slices - 1 // Math.floor(Math.random() * slices)
        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2
        for (let i = 0; i < slices; i++) {
            let copy
            if (i === this.winningSliceIndex) {
                copy = winningCopy
            } else {
                copy = placeholderCopies[Math.floor(Math.random() * placeholderCopies.length)]
            }
            const wheelPortion = new WheelPortion(
                this,
                radius,
                PIXI.utils.string2hex(colours[i]),
                undefined,
                angle,
                angle * i,
                copy,
                i === this.winningSliceIndex
            )
            wheelPortion.position = {
                x: app.screen.width / 2,
                y: app.screen.height / 2
            }
            this.addChild(wheelPortion)
            this.slices.push(wheelPortion)
        }
        let pin = PIXI.Sprite.from('assets/pin.png')
        // pin.width = 40
        // pin.height = 60
        // pin.anchor.set(0, 0.5)
        pin.tint = 0x0000ff
        pin.x = this.width + this.getBounds().x
        pin.y = (this.height + this.getBounds().y) / 2 - pin.height / 2
        pin.angle = 90
        this.addChild(pin)
        let circle = new PIXI.Graphics()
        circle.drawCircle(0,0, radius)
        circle.lineStyle(10, 0xffffff)
        this.addChild(circle)
    }

    move(delta) {
        this.slices.forEach(slice => slice.move(delta))
    }

    spin(forcedIndex = undefined) {
        if (forcedIndex) {
            const minExpectedRotation = this.winningSliceIndex * this.slices.length / 360 + 1
            const maxExpectedRotation = this.winningSliceIndex * (this.slices.length / 360 + 1) - 1
            const expectedRotation = minExpectedRotation + Math.random() * (maxExpectedRotation - minExpectedRotation)

        }
        this.spinOptions = {
            totalDuration: 6000,
            accelerationDuration: 2000,
            maxSpeed: 0.3
        };
        this.spinStart = Date.now()
        this.isSpinning = true
    }
}
// 1/2 * 0.2 * 2000 ^ 2
