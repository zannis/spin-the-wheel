import { Application, Container, Sprite, Texture } from 'pixi.js-legacy'
import WheelSlice from './wheel-slice'
import palette from 'distinct-colors'
import { Resizable, ResizeOptionsWH, SpinOptions, WheelOptions } from '../types'
import * as sound from 'pixi-sound'
import {MAX_SLICES, MIN_SLICES, normalizedRadius} from '../utils'
import OuterGraphics from './outer-graphics'
import CenterGraphics from './center-graphics'
import Banner from './banner'

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>
    from<T>(arrayLike: ArrayLike<T>): Array<T>
}

export default class Wheel extends Container implements Resizable {
    slices: WheelSlice[]
    readonly winningSliceIndex: number
    spinOptions: SpinOptions
    spinStart: number
    isSpinning: boolean
    hasSpinned: boolean
    outer: OuterGraphics
    private banner: Banner
    private pointerAngle: number
    private center: CenterGraphics

    constructor(app: Application, options: WheelOptions) {
        super()
        let { slices } = options
        const { winningCopy, placeholderCopies, radius } = options
        if (slices < MIN_SLICES) {
            console.warn('Tried to instantiate a wheel with less than 3 slices.')
            slices = 3
        }
        if (slices > MAX_SLICES) {
            console.warn('Tried to instantiate a wheel with more than 16 slices.')
            slices = 16
        }
        const _angle = 360 / slices
        this.name = 'wheel'
        this.slices = []
        this.outer = new OuterGraphics(app, radius, slices)
        this.center = new CenterGraphics(radius)
        this.banner = new Banner(radius, 315)
        this.pointerAngle = 270
        this.winningSliceIndex = Math.floor(Math.random() * slices)
        // this.pivot.x = this.width / 2
        // this.pivot.y = this.height / 2
        this.slices = this._slices(app, slices, 5, winningCopy, this.winningSliceIndex, placeholderCopies, Math.floor(radius * 0.8), _angle)
        this.addChild(this.outer)
        this.addChild(...this.slices)
        this.addChild(this.center)
        this.addChild(this.banner)
    }

    private _slices(
        app: Application,
        slices: number,
        colors: number,
        winningCopy: string,
        winningIndex: number,
        placeholderCopies: string[],
        radius: number,
        angle: number
    ): WheelSlice[] {
        const result = []
        const colours = palette({
            count: colors,
        })
        for (let i = 0; i < slices; i++) {
            let copy
            if (i === winningIndex) {
                copy = winningCopy
            } else {
                copy = placeholderCopies[Math.floor(Math.random() * placeholderCopies.length)]
            }
            const wheelPortion = new WheelSlice(this, radius, colours[i % colours.length].num(), undefined, angle, angle * i, copy, false)

            result.push(wheelPortion)
        }
        return result
    }

    move(delta: number) {
        if (this.isSpinning && !this.hasSpinned) this.slices.forEach((slice) => slice.move(delta))
    }

    spin() {
        this.spinOptions = this._calculateSpinOptions()
        sound.default.add({
            spin: 'assets/spin.mp3',
        })
        // void sound.default.play('spin')
        // this.spinStart = Date.now()
        this.isSpinning = true
        this.slices.forEach(slice => slice.isSpinning = true)
    }

    resize(options: ResizeOptionsWH) {
        const radius = normalizedRadius(Math.min(options.width, options.height) / 2)
        this.center.resize({ radius })
        this.outer.resize({ radius })
        this.banner.resize({ radius })
        this.slices.forEach((slice: WheelSlice) => slice.resize(radius * 0.8))
    }

    _calculateSpinOptions(): SpinOptions {
        const _angle = 360 / this.slices.length
        const minExpectedRotation = 360 * 4 + (this.pointerAngle)  - (this.winningSliceIndex + 1) * _angle  - (_angle * 0.1)
        const maxExpectedRotation = 360 * 4  + (this.pointerAngle)  - this.winningSliceIndex * (_angle * 0.9)
        const totalAngleDifference = minExpectedRotation + Math.random() * ((maxExpectedRotation - minExpectedRotation) / 2)
        const MAX_SPEED = 0.2
        console.log({ totalAngleDifference, MAX_SPEED })
        return {
            totalAngle: totalAngleDifference,
            accelerationUntilAngle: totalAngleDifference / 4,
            maxSpeed: MAX_SPEED,
        }
    }

}
