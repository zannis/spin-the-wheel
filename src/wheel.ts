import * as PIXI from 'pixi.js'
import WheelSlice from './wheel-slice'
import palette from 'distinct-colors'
import { SpinOptions, WheelOptions } from './types'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import * as sound from 'pixi-sound'
import { borders } from './utils'

export default class Wheel extends PIXI.Container {
    slices: WheelSlice[]
    readonly winningSliceIndex: number
    spinOptions: SpinOptions
    spinStart: number
    isSpinning: boolean
    hasSpinned: boolean
    private expectedRotation: number

    constructor(app: PIXI.Application, name: string, options: WheelOptions) {
        super()
        const { slices, winningCopy, placeholderCopies, radius } = options
        this.name = name
        this.slices = []
        const _angle = 360 / slices || 0
        this.winningSliceIndex = Math.floor(Math.random() * slices)
        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2
        this.addChild(this._outerGraphics(app, radius, slices))
        const sliceArray = this._slices(app, slices, 2, winningCopy, this.winningSliceIndex, placeholderCopies, radius, _angle)
        this.slices = sliceArray
        this.addChild(...sliceArray)
        // this.addChild(this._pin())
        this.addChild(this._centerGraphics(app, radius))
        this.addChild(this._banner(app))
        const minExpectedRotation = 360 - (this.winningSliceIndex + 1) * _angle + 5
        const maxExpectedRotation = 360 - this.winningSliceIndex * _angle - 5
        this.expectedRotation = minExpectedRotation + Math.random() * ((maxExpectedRotation - minExpectedRotation) / 2)
        this.addChild(borders(this))
    }

    private _centerGraphics(app: PIXI.Application, radius: number) {
        const texture = PIXI.Texture.from('assets/center-graphics.svg')
        const center = new PIXI.Sprite(texture)
        center.filters = [
            new DropShadowFilter({
                rotation: 90,
                distance: 10,
            }),
        ]
        center.width = (2 * radius) / 3
        center.height = (2 * radius) / 3
        center.anchor.set(0.5)
        center.position.x = app.screen.width / 2
        center.position.y = app.screen.height / 2
        center.addChild(borders(center))
        return center
    }
    private _outerGraphics(app: PIXI.Application, radius: number, slices: number) {
        const texture = PIXI.Texture.from('assets/outer-graphics.svg')
        const center = new PIXI.Sprite(texture)
        center.width = 2 * radius * 1.25
        center.height = 2 * radius * 1.25
        center.anchor.set(0.5)
        center.position.x = app.screen.width / 2
        center.position.y = app.screen.height / 2
        return center
    }
    private _banner(app: PIXI.Application) {
        const container = new PIXI.Container()
        const bannerTexture = PIXI.Texture.from('assets/banner.svg')
        const pinTexture = PIXI.Texture.from('assets/center-graphics.svg')

        const bannerSprite = new PIXI.Sprite(bannerTexture)
        const pinSprite = new PIXI.Sprite(pinTexture)
        bannerSprite.anchor.set(0.5)
        pinSprite.anchor.set(0.5)
        pinSprite.width = 20
        pinSprite.height = 20
        console.log(bannerSprite.getBounds())
        pinSprite.position.x = bannerSprite.getBounds().x
        pinSprite.position.y = bannerSprite.getBounds().y - 15

        container.position.x = app.screen.width / 2
        container.position.y = app.screen.width / 11
        container.addChild(bannerSprite, pinSprite)
        container.addChild(borders(container))
        container.filters = [
            new DropShadowFilter({
                rotation: 90,
                distance: 10,
            }),
        ]
        return container
    }

    private _slices(
        app: PIXI.Application,
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
            const wheelPortion = new WheelSlice(this, radius, colours[i % colours.length].num(), undefined, angle, angle * i, copy, i === winningIndex)
            wheelPortion.position.x = app.screen.width / 2
            wheelPortion.position.y = app.screen.height / 2
            result.push(wheelPortion)
        }
        return result
    }

    move(delta: number) {
        if (!this.hasSpinned) this.slices.forEach((slice) => slice.move(delta))
    }

    spin() {
        this.spinOptions = _calculateSpinOptions(this.expectedRotation)
        sound.default.add({
            spin: 'assets/spin.mp3',
        })
        // void sound.default.play('spin')
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
