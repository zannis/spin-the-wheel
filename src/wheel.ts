import * as PIXI from 'pixi.js'
import WheelSlice from './wheel-slice'
import palette from 'distinct-colors'
import {SpinOptions, WheelOptions} from "./types"

export default class Wheel extends PIXI.Container {
    private slices: WheelSlice[]
    private winningSliceIndex: number
    spinOptions: SpinOptions
    spinStart: number
    isSpinning: boolean

    constructor(
        app: PIXI.Application,
        name: string,
        options : WheelOptions
    ) {
        super()
        const {slices, winningCopy, placeholderCopies, radius} = options
        let colours = palette({
            count: slices
        })
        this.name = name
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
            const wheelPortion = new WheelSlice(
                this,
                radius,
                colours[i].num(),
                undefined,
                angle,
                angle * i,
                copy,
                i === this.winningSliceIndex
            )
            wheelPortion.position.x = app.screen.width / 2
            wheelPortion.position.y = app.screen.height / 2
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
        circle.drawCircle(0, 0, radius)
        circle.lineStyle(10, 0xffffff)
        this.addChild(circle)
    }

    move(delta: number) {
        this.slices.forEach(slice => slice.move(delta))
    }

    spin(forcedIndex: number = undefined) {
        if (forcedIndex) {
            // const minExpectedRotation = this.winningSliceIndex * this.slices.length / 360 + 1
            // const maxExpectedRotation = this.winningSliceIndex * (this.slices.length / 360 + 1) - 1
            // const expectedRotation = minExpectedRotation + Math.random() * (maxExpectedRotation - minExpectedRotation)
        }
        this.spinOptions = {
            totalDuration: 6000,
            accelerationDuration: 2000,
            maxSpeed: 0.3
        }
        this.spinStart = Date.now()
        this.isSpinning = true
    }
}
