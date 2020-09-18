import * as PIXI from 'pixi.js'
import WheelSlice from './wheel-slice'
import palette from 'distinct-colors'
import { SpinOptions, WheelOptions } from './types'

export default class Wheel extends PIXI.Container {
    slices: WheelSlice[]
    readonly winningSliceIndex: number
    spinOptions: SpinOptions
    spinStart: number
    isSpinning: boolean

    constructor(app: PIXI.Application, name: string, options: WheelOptions) {
        super()
        const { slices, winningCopy, placeholderCopies, radius } = options
        this.name = name
        this.slices = []
        const _angle = 360 / slices
        this.winningSliceIndex = Math.floor(Math.random() * slices)
        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2
        this.addChild(_hollowCircle(app, 0xfafafa, radius))
        this.addChild(_circle(app, radius * 1.1))
        const sliceArray = this._slices(app, slices, winningCopy, this.winningSliceIndex, placeholderCopies, radius, _angle)
        this.addChild(...sliceArray)
        this.slices = sliceArray
        this._addPin()
    }

    private _addPin() {
        const pin = PIXI.Sprite.from('assets/pin.png')
        // pin.width = 40
        // pin.height = 60
        // pin.anchor.set(0, 0.5)
        pin.tint = 0x0000ff
        pin.x = this.width + this.getBounds().x
        pin.y = (this.height + this.getBounds().y) / 2 - pin.height / 2
        pin.angle = 90
        this.addChild(pin)
    }

    private _slices(app: PIXI.Application, slices: number, winningCopy: string, winningIndex: number, placeholderCopies: string[], radius: number, angle: number): WheelSlice[] {
        const result = []
        const colours = palette({
            count: slices,
        })
        for (let i = 0; i < slices; i++) {
            let copy
            if (i === winningIndex) {
                copy = winningCopy
            } else {
                copy = placeholderCopies[Math.floor(Math.random() * placeholderCopies.length)]
            }
            const wheelPortion = new WheelSlice(this, radius, colours[i].num(), undefined, angle, angle * i, copy, i === winningIndex)
            wheelPortion.position.x = app.screen.width / 2
            wheelPortion.position.y = app.screen.height / 2
            result.push(wheelPortion)
        }
        return result
    }

    move(delta: number) {
        this.slices.forEach((slice) => slice.move(delta))
    }

    spin(forcedIndex: number = undefined) {
        let expectedRotation
        if (forcedIndex) {
            const minExpectedRotation = (this.winningSliceIndex * this.slices.length) / 360 + 1
            const maxExpectedRotation = this.winningSliceIndex * (this.slices.length / 360 + 1) - 1
            expectedRotation = minExpectedRotation + Math.random() * (maxExpectedRotation - minExpectedRotation / 2)
        } else {
            expectedRotation = Math.random() * 360
        }
        this.spinOptions = _calculateSpinOptions(expectedRotation)
        this.spinStart = Date.now()
        this.isSpinning = true
    }
}

function _hollowCircle(app: PIXI.Application, color: number, radius: number) {
    const circle = new PIXI.Graphics()
    circle.beginFill(color)
    circle.drawCircle(0, 0, radius)
    circle.beginHole()
    circle.drawCircle(0, 0, radius - 0.2)
    circle.endHole()
    circle.endFill()
    circle.position.x = app.screen.width / 2
    circle.position.y = app.screen.height / 2
    return circle
}

function _circle(app: PIXI.Application, radius: number) {
    const circle = new PIXI.Graphics()
    circle.beginFill(0xfafafa)
    circle.drawCircle(0, 0, radius)
    circle.lineStyle(10, 0xfff)
    circle.endFill()
    circle.position.x = app.screen.width / 2
    circle.position.y = app.screen.height / 2
    return circle
}

function _calculateSpinOptions(expectedAngleInDegs: number): SpinOptions {
    console.log('expected angle ', expectedAngleInDegs)
    const normalizedAngle = (expectedAngleInDegs / 170) * 1000
    const expectedMaxSpeed = normalizedAngle / 5000
    console.log({ normalizedAngle, expectedMaxSpeed })
    return {
        totalDuration: 5000,
        accelerationDuration: 2000,
        maxSpeed: expectedMaxSpeed,
    }
}
