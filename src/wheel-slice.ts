import { SpinOptions } from './types'
import { DEG_TO_RAD, Graphics, RAD_TO_DEG, Text } from 'pixi.js'
import Wheel from './wheel'

export default class WheelSlice extends Graphics {
    wheel: Wheel
    readonly debug: boolean
    angleStart: number
    // private isSpinning: boolean

    constructor(wheel: Wheel, radius: number, color: number, lineColor = 0x000, angle: number, angleOffset: number, text = 'sample text', debug = false) {
        super()

        const s = 0
        const c = lineColor || color
        const label = new Text(text, {
            fontFamily: 'Nunito Sans',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left',
        })
        label.anchor.set(0, 0)
        label.pivot.x = 0 // radius / 2
        label.pivot.y = label.height / 2 // radius / 2
        label.angle = angle / 2
        const minLabelRadius = Math.min(radius * 0.3, radius - label.width) + radius * 0.05
        const maxLabelRadius = Math.max(radius * 0.5, radius - label.width) - radius * 0.05
        const meanLabelRadius = (maxLabelRadius + minLabelRadius) / 2
        label.x = meanLabelRadius * Math.cos((DEG_TO_RAD * angle) / 2)
        label.y = meanLabelRadius * Math.sin((DEG_TO_RAD * angle) / 2) // - (label.height / 2)
        this.addChild(label)
        const labelBorders = new Graphics()
        labelBorders
            .lineStyle(4, 0x243343)
            .moveTo(label.x, label.y)
            .lineTo(label.x, label.y + label.height)
            .lineTo(label.x + label.width, label.y + label.height)
            .lineTo(label.x + label.width, label.y)
            .lineTo(label.x, label.y)
        // this.addChild(labelBorders)
        this.wheel = wheel
        this.pivot.x = 0
        this.pivot.y = 0
        // this.isSpinning = false
        this.debug = debug
        this.angleStart = 0
        this.lineStyle(s, c)
        this.beginFill(color)
        this.lineTo(radius, 0)
        this.arc(0, 0, radius, 0, DEG_TO_RAD * angle)
        this.lineTo(0, 0)
        this.angle = angleOffset
        this.endFill()
        const borders = new Graphics()
        borders
            .lineStyle(4, 0x243343)
            .moveTo(0, 0)
            .lineTo(0, 0 + this.height)
            .lineTo(0 + this.width, 0 + this.height)
            .lineTo(0 + this.width, 0)
            .lineTo(0, 0)

        this.addChild(borders)
        // let halfCircle = new PIXI.Graphics()
        // halfCircle.beginFill(0x0f0f0f)
        // halfCircle.drawCircle(0, 0, radius/2)
        // halfCircle.endFill()
        // this.addChild(halfCircle)
    }

    spin(delta: number, options: SpinOptions, debug: boolean) {
        const { totalDuration, accelerationDuration, maxSpeed } = options
        const decelerationTime = totalDuration - accelerationDuration
        const currentTime = Date.now() - this.wheel.spinStart
        const accelerationSpeed = maxSpeed * (currentTime / accelerationDuration)
        const decelerationSpeed = maxSpeed * (1 - (currentTime - accelerationDuration) / decelerationTime)
        // const logAS = Math.log(1 / accelerationSpeed)

        if (currentTime <= accelerationDuration) {
            // this.rotation += accelerationSpeed * delta
            this.angle += RAD_TO_DEG * accelerationSpeed * delta
        } else if (currentTime <= totalDuration) {
            // this.rotation += decelerationSpeed * delta
            this.angle += RAD_TO_DEG * decelerationSpeed * delta
        } else {
            this.angle += 0
            if (this.wheel.isSpinning) {
                this.wheel.isSpinning = false
            }
        }
    }

    move(delta: number) {
        if (this.wheel.isSpinning) {
            this.spin(delta, this.wheel.spinOptions, this.debug)
        } else {
            const angleDiff = this.angle - this.angleStart
            if (this.debug && angleDiff > 0) console.debug(angleDiff)
            this.angleStart = this.angle
        }
    }
}
