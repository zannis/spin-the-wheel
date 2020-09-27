import { Application, Container, Sprite, Texture } from 'pixi.js-legacy'
import WheelSlice from './wheel-slice'
import palette from 'distinct-colors'
import {Resizable, ResizeOptionsRad, ResizeOptionsWH, SpinOptions, WheelOptions} from '../types'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import * as sound from 'pixi-sound'
import { borders, MAX_SLICES, normalizedRadius } from '../utils'
import OuterGraphics from './outer-graphics'
import CenterGraphics from './center-graphics'

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>
    from<T>(arrayLike: ArrayLike<T>): Array<T>
}

class Banner extends Container implements Resizable {
    private banner: Sprite
    private pin: Sprite

    constructor(radius: number) {
        super()
        this.name = 'banner'
        this.filters = [
            new DropShadowFilter({
                rotation: 90,
                distance: 10,
            }),
        ]
        const _banner = () => {
            const banner = new Sprite(Texture.from('assets/banner.svg'))
            banner.name = 'block'
            banner.anchor.set(0.5)
            return banner
        }
        const _pin = () => {
            const pin = new Sprite(Texture.from('assets/center-graphics.svg'))
            pin.name = 'pin'
            pin.anchor.set(0.5)
            return pin
        }
        this.banner = _banner()
        this.pin = _pin()
        this.addChild(this.banner)
        this.addChild(this.pin)
        this.resize({ radius })
    }
    resize(options: ResizeOptionsRad): void {
        this.banner.position.x = window.innerWidth / 2
        this.banner.width = options.radius * 0.9
        this.banner.height = options.radius * 0.4
        this.banner.position.y = window.innerHeight / 2 - (options.radius - options.radius / 10)
        this.pin.width = options.radius / 11
        this.pin.height = options.radius / 11
        this.pin.position.x = this.banner.x
        this.pin.position.y = this.banner.y - options.radius / 20
    }
}

export default class Wheel extends Container implements Resizable {
    slices: WheelSlice[]
    readonly winningSliceIndex: number
    spinOptions: SpinOptions
    spinStart: number
    isSpinning: boolean
    hasSpinned: boolean
    private expectedRotation: number
    outer: OuterGraphics
    private banner: Banner
    constructor(app: Application, name: string, options: WheelOptions) {
        super()
        let { slices } = options
        const { winningCopy, placeholderCopies, radius } = options
        if (slices < 3) {
            console.warn('Tried to instantiate a wheel with less than 3 slices.')
            slices = 3
        }
        if (slices > MAX_SLICES) {
            console.warn('Tried to instantiate a wheel with more than 16 slices.')
            slices = 16
        }
        const _angle = 360 / slices
        this.name = name
        this.slices = []
        this.outer = new OuterGraphics(app, radius, slices)
        this.center = new CenterGraphics(radius)
        this.banner = new Banner(radius)
        this.winningSliceIndex = Math.floor(Math.random() * slices)
        // this.pivot.x = this.width / 2
        // this.pivot.y = this.height / 2
        this.slices = this._slices(app, slices, 5, winningCopy, this.winningSliceIndex, placeholderCopies, Math.floor(radius * 0.8), _angle)
        this.addChild(this.outer)
        this.addChild(...this.slices)
        this.addChild(this.center)
        this.addChild(this.banner)
        const minExpectedRotation = 360 - (this.winningSliceIndex + 1) * _angle + 5
        const maxExpectedRotation = 360 - this.winningSliceIndex * _angle - 5
        this.expectedRotation = minExpectedRotation + Math.random() * ((maxExpectedRotation - minExpectedRotation) / 2)
        // this.addChild(borders(this))
    }

    private center: CenterGraphics

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
            const wheelPortion = new WheelSlice(this, radius, colours[i % colours.length].num(), undefined, angle, angle * i, copy, true)

            result.push(wheelPortion)
        }
        return result
    }

    move(delta: number) {
        if (this.isSpinning && !this.hasSpinned) this.slices.forEach((slice) => slice.move(delta))
    }

    spin() {
        this.spinOptions = _calculateSpinOptions(this.expectedRotation)
        sound.default.add({
            spin: 'assets/spin.mp3',
        })
        void sound.default.play('spin')
        this.spinStart = Date.now()
        this.isSpinning = true
    }

    resize(options: ResizeOptionsWH) {
        const radius = normalizedRadius(Math.min(options.width, options.height) / 2)
        this.center.resize({ radius })
        this.outer.resize({ radius })
        this.banner.resize({ radius })
        this.slices.forEach((slice: WheelSlice) => slice.resize(radius * 0.8))
    }
}

function _calculateSpinOptions(expectedAngleInDegs: number): SpinOptions {
    const MAX_SPEED = 0.2
    const MAX_DURATION = 10000
    const totalAngleDifference = expectedAngleInDegs
    const normalizedAngleDifference = totalAngleDifference / 170
    const totalDuration = normalizedAngleDifference / MAX_SPEED
    const actualDuration = Math.min(totalDuration * 1000, MAX_DURATION)
    console.log({ totalAngleDifference, actualDuration, MAX_SPEED })
    return {
        totalDuration: actualDuration,
        accelerationDuration: actualDuration / 3,
        maxSpeed: MAX_SPEED,
    }
}
