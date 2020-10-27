import { Container } from 'pixi.js-legacy'
import WheelSlice from './wheel-slice'
import palette from 'distinct-colors'
import { Resizable, ResizeOptionsWH, SpinOptions, WheelOptions } from '../types'
import sound from 'pixi-sound'
import { MAX_SLICES, MIN_SLICES } from '../utils'
import OuterGraphics from './outer-graphics'
import CenterGraphics from './center-graphics'
import Banner from './banner'

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>
    from<T>(arrayLike: ArrayLike<T>): Array<T>
}

export default class Wheel extends Container implements Resizable {
    slices: WheelSlice[]
    winningSliceIndex: number
    spinOptions: SpinOptions
    isSpinning: boolean
    hasSpinned: boolean
    outer: OuterGraphics
    private banner: Banner
    private pointerAngle: number
    private center: CenterGraphics

    constructor(options: WheelOptions) {
        super()
        let { slices } = options
        const { winningCopy, placeholderCopies, radius } = options
        if (slices < MIN_SLICES) {
            console.debug('Tried to instantiate a wheel with less than 3 slices.')
            slices = 3
        }
        if (slices > MAX_SLICES) {
            console.debug('Tried to instantiate a wheel with more than 16 slices.')
            slices = 16
        }
        const _angle = 360 / slices
        this.name = 'wheel'
        this.slices = []
        this.outer = new OuterGraphics(radius, slices)
        this.center = new CenterGraphics(radius)
        this.banner = new Banner(radius, 315)
        this.pointerAngle = 270
        this.winningSliceIndex = Math.floor(Math.random() * slices)
        // this.pivot.x = this.width / 2
        // this.pivot.y = this.height / 2
        this.slices = this._slices(slices, 5, winningCopy, this.winningSliceIndex, placeholderCopies, Math.floor(radius * 0.8), _angle)
        this.addChild(this.outer)
        this.addChild(...this.slices)
        this.addChild(this.center)
        this.addChild(this.banner)
    }

    private _slices(
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
        if (this.isSpinning && !this.hasSpinned) {
            this.slices.forEach((slice) => slice.move(delta))
            this.outer.indicators.forEach((ind) => ind.move(this.slices[0].angle))
        }
    }

    spin() {
        this.spinOptions = this._calculateSpinOptions()
        sound.add({
            spin: 'assets/spin.mp3',
        })
        // void sound.default.play('spin')
        // this.spinStart = Date.now()
        this.isSpinning = true
        this.slices.forEach((slice) => {
            slice.isSpinning = true
        })
    }

    resize(options: ResizeOptionsWH) {
        const radius = Math.min(Math.min(options.width, options.height) / 2, Math.min(Math.floor(window.innerWidth / 2), window.innerHeight / 2) * 0.9)
        this.center.resize({ radius })
        this.outer.resize({ radius })
        this.banner.resize({ radius })
        this.slices.forEach((slice: WheelSlice) => slice.resize(radius * 0.8))
    }

    _calculateSpinOptions(): SpinOptions {
        const _angle = 360 / this.slices.length
        const minExpectedRotation = 360 * 4 + this.pointerAngle - (this.winningSliceIndex + 1) * _angle + _angle * 0.1
        const maxExpectedRotation = 360 * 4 + this.pointerAngle - this.winningSliceIndex * _angle - _angle * 0.1
        const totalAngleDifference = minExpectedRotation + Math.random() * ((maxExpectedRotation - minExpectedRotation) / 2)
        const MAX_SPEED = 0.2
        return {
            totalAngle: totalAngleDifference,
            accelerationUntilAngle: totalAngleDifference / 4,
            decelerationStartAngle: (totalAngleDifference * 3) / 5,
            maxSpeed: MAX_SPEED,
        }
    }
}
