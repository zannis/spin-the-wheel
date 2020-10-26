import { DEG_TO_RAD, Graphics, RAD_TO_DEG, Text } from 'pixi.js-legacy'
import Wheel from './wheel'
import { borders } from '../utils'

export default class WheelSlice extends Graphics {
    readonly debug: boolean
    readonly wheel: Wheel
    readonly label: Text
    readonly arcSpan: number
    readonly color: number
    readonly text: string
    readonly lineColor: number
    radius: number
    angleStart: number
    isSpinning: boolean

    constructor(wheel: Wheel, radius: number, color: number, lineColor = 0x000, angle: number, angleOffset: number, text = 'sample text', debug = false) {
        super()
        this.arcSpan = angle
        this.color = color
        this.lineColor = lineColor
        this.label = _label(text, radius, angle)
        this.radius = radius
        this.name = `slice-${Math.ceil(angleOffset / angle)}`
        this.wheel = wheel
        this.text = text
        this.debug = debug
        this.angleStart = 0
        this.isSpinning = false
        this.angle = angleOffset
        this.angleStart = angleOffset
        this.resize(radius)
    }

    spin(delta: number) {
        const options = this.wheel.spinOptions
        const maxSpeed = options.maxSpeed
        const totalAngle = options.totalAngle
        const accelerationUntilAngle = options.accelerationUntilAngle
        const decelerationStartAngle = options.decelerationStartAngle
        const currentAngle = this.angle - this.angleStart

        // const logAS = Math.log(1 / accelerationSpeed)

        if (currentAngle <= accelerationUntilAngle) {
            const accelerationSpeed = maxSpeed * ((currentAngle + 90) / accelerationUntilAngle)
            this.angle += RAD_TO_DEG * accelerationSpeed * delta
        } else if (currentAngle <= decelerationStartAngle) {
            this.angle += RAD_TO_DEG * maxSpeed * delta
        } else if (currentAngle <= totalAngle) {
            const decelerationSpeed = maxSpeed * (1 - (currentAngle - decelerationStartAngle) / (totalAngle - decelerationStartAngle))
            this.angle += RAD_TO_DEG * decelerationSpeed * delta
        } else {
            this.angle += 0
            this.isSpinning = false
            const zeroSpinningSlices = !this.wheel.slices.some((slice) => slice.isSpinning)
            if (this.wheel.isSpinning && zeroSpinningSlices) {
                this.wheel.isSpinning = false
                this.wheel.hasSpinned = true
            }
        }
    }

    move(delta: number) {
        if (!this.wheel.spinOptions) {
            throw new Error('Spin options are missing.')
        }

        if (this.isSpinning) {
            this.spin(delta)
        }
    }

    resize(radius: number) {
        // handle size
        const s = 0
        this.position.x = window.innerWidth / 2
        this.position.y = window.innerHeight / 2
        this.radius = radius
        const c = this.lineColor || this.color
        this.clear()
        this.lineStyle(s, c)
        this.beginFill(this.color)
        this.lineTo(radius, 0)
        this.arc(0, 0, this.radius, 0, DEG_TO_RAD * this.arcSpan)
        this.lineTo(0, 0)
        this.endFill()
        // handle label
        const newLabel = _label(this.text, this.radius, this.arcSpan)
        this.removeChildren()
        this.addChild(newLabel)
        if (this.debug) this.addChild(borders(newLabel))
        // if (this.debug) this.addChild(borders(this))
    }
}

function _label(text: string, radius: number, angle: number): Text {
    const fontSize = radius > 400 ? 36 : radius > 300 ? 30 : radius > 250 ? 26 : radius > 200 ? 20 : 16
    const label = new Text(text, {
        fontFamily: 'Nunito Sans',
        fontSize,
        fill: 0xffffff,
        align: 'left',
    })
    label.name = `label`
    label.anchor.set(0)
    label.pivot.x = 0
    label.pivot.y = label.height / 2
    label.angle = angle / 2
    const minLabelRadius = Math.min(radius * 0.3, radius - label.width) + radius * 0.05
    const maxLabelRadius = Math.max(radius * 0.5, radius - label.width) - radius * 0.05
    const meanLabelRadius = (maxLabelRadius + minLabelRadius) / 2
    label.x = meanLabelRadius * Math.cos((DEG_TO_RAD * angle) / 2)
    label.y = meanLabelRadius * Math.sin((DEG_TO_RAD * angle) / 2)
    return label
}
