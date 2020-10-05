import { SpinOptions } from '../types'
import { DEG_TO_RAD, Graphics, RAD_TO_DEG, Text } from 'pixi.js-legacy'
import Wheel from './wheel'
import { borders, DEFAULT_ACCELERATION_DURATION, DEFAULT_DURATION, DEFAULT_MAX_SPEED } from '../utils'

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
        this.label = _label(text, radius, angle, debug)
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

    spin(delta: number, options: SpinOptions, debug: boolean) {
        const { totalAngle, accelerationUntilAngle, maxSpeed } = options
        const decelerationTime = totalAngle - accelerationUntilAngle
        const currentTime = Date.now() - this.wheel.spinStart
        const accelerationSpeed = maxSpeed * (currentTime / accelerationUntilAngle)
        const decelerationSpeed = maxSpeed * (1 - (currentTime - accelerationUntilAngle) / decelerationTime)
        // const logAS = Math.log(1 / accelerationSpeed)

        if (currentTime <= accelerationUntilAngle && currentTime <= totalAngle) {
            // this.rotation += accelerationSpeed * delta
            this.angle += RAD_TO_DEG * accelerationSpeed * delta
        } else if (currentTime <= totalAngle) {
            // this.rotation += decelerationSpeed * delta
            this.angle += RAD_TO_DEG * decelerationSpeed * delta
        } else {
            this.angle += 0
            if (this.wheel.isSpinning) {
                this.wheel.isSpinning = false
                this.wheel.hasSpinned = true
            }
        }
    }
    spin2(delta: number, options: SpinOptions, debug: boolean) {
        const { maxSpeed } = options
        const totalAngle = options.totalAngle
        const accelerationUntilAngle = options.accelerationUntilAngle
        const currentAngle = this.angle - this.angleStart
        const decelerationAngle = totalAngle - accelerationUntilAngle
        const accelerationSpeed = maxSpeed * ((currentAngle + 90) / accelerationUntilAngle)
        const decelerationSpeed = maxSpeed * (1 - (currentAngle - accelerationUntilAngle) / decelerationAngle)
        // const logAS = Math.log(1 / accelerationSpeed)

        if (currentAngle <= accelerationUntilAngle) {
            this.angle += RAD_TO_DEG * accelerationSpeed * delta
        } else if (currentAngle <= totalAngle) {
            this.angle += RAD_TO_DEG * decelerationSpeed * delta
        } else {
            this.angle += 0
            this.isSpinning = false
            const zeroSpinningSlices = !this.wheel.slices.some(slice => slice.isSpinning)
            if (this.wheel.isSpinning && zeroSpinningSlices) {
                this.wheel.isSpinning = false
                this.wheel.hasSpinned = true
            }
        }
    }

    move(delta: number) {
        if (!this.wheel.spinOptions) {
            console.warn('Spin options are missing. Using default values.')
            this.wheel.spinOptions = {
                totalAngle: DEFAULT_DURATION,
                accelerationUntilAngle: DEFAULT_ACCELERATION_DURATION,
                maxSpeed: DEFAULT_MAX_SPEED
            }
        }

        if (this.wheel.isSpinning) {
            this.spin2(delta, this.wheel.spinOptions, this.debug)
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
        const newLabel = _label(this.text, this.radius, this.arcSpan, this.debug)
        this.removeChildren()
        this.addChild(newLabel)
        if (this.debug) this.addChild(borders(newLabel))
        // if (this.debug) this.addChild(borders(this))
    }
}

function _label(text: string, radius: number, angle: number, debug: boolean): Text {
    const fontSize = radius > 400 ? 36 : radius > 300 ? 24 : radius > 200 ? 20 : 16
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
