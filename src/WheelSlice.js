import * as PIXI from "./pixi";

export default class WheelPortion extends PIXI.Graphics {

    constructor (wheel, radius, color, lineColor = 0x000, angle, angleOffset, text = 'sample text', debug = false) {
        super()

        let s = 0
        let c = lineColor || color
        let label = new PIXI.Text(text, {
            fontFamily: 'Nunito Sans',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left'
        })
        label.anchor.set(0, 0)
        label.pivot.x = 0 //radius / 2
        label.pivot.y = label.height / 2 //radius / 2
        label.angle = angle / 2
        let minLabelRadius = Math.min(radius * 0.3, radius - label.width) + (radius * 0.05)
        let maxLabelRadius = Math.max(radius * 0.5, radius - label.width) - (radius * 0.05)
        let meanLabelRadius = (maxLabelRadius + minLabelRadius) / 2
        label.x = meanLabelRadius * Math.cos(PIXI.DEG_TO_RAD * angle / 2)
        label.y = meanLabelRadius * Math.sin(PIXI.DEG_TO_RAD * angle / 2) //- (label.height / 2)
        this.addChild(label)
        let labelBorders = new PIXI.Graphics()
        labelBorders
            .lineStyle({
                color: 0x243343,
                width: 4
            })
            .moveTo(label.x,label.y)
            .lineTo(label.x, label.y + label.height)
            .lineTo(label.x + label.width, label.y + label.height)
            .lineTo(label.x + label.width, label.y)
            .lineTo(label.x,label.y)
        // this.addChild(labelBorders)
        this.wheel = wheel
        this.pivot.x = 0
        this.pivot.y = 0
        this.isSpinning = false
        this.debug = debug
        this.angleStart = angle
        this.lineStyle(s, c)
        this.beginFill(color)
        this.lineTo(radius, 0)
        this.arc(0, 0, radius, 0, PIXI.DEG_TO_RAD * (angle))
        this.lineTo(0, 0)
        this.angle = angleOffset
        this.endFill()
        let borders = new PIXI.Graphics()
        borders
            .lineStyle({
                color: 0x243343,
                width: 4
            })
            .moveTo(0,0)
            .lineTo(0, 0 + this.height)
            .lineTo(0 + this.width, 0 + this.height)
            .lineTo(0 + this.width, 0)
            .lineTo(0,0)

        // this.addChild(borders)
        // let halfCircle = new PIXI.Graphics()
        // halfCircle.beginFill(0x0f0f0f)
        // halfCircle.drawCircle(0, 0, radius/2)
        // halfCircle.endFill()
        // this.addChild(halfCircle)
    }

    spin(delta, {
        totalDuration,
        accelerationDuration: accelerationTime,
        maxSpeed
    },
         debug) {
        const decelerationTime = totalDuration - accelerationTime
        const currentTime = Date.now() - this.wheel.spinStart
        const accelerationSpeed = maxSpeed * (currentTime / accelerationTime)
        const decelerationSpeed = maxSpeed * (1 - (currentTime - accelerationTime) / decelerationTime)
        const logAS = Math.log(1 / accelerationSpeed)

        if (currentTime <= accelerationTime) {
            // this.rotation += accelerationSpeed * delta
            this.angle += PIXI.RAD_TO_DEG * accelerationSpeed * delta
            if (debug) console.debug(`accelerating ${this.angle}`)
        } else if (currentTime <= totalDuration) {
            // this.rotation += decelerationSpeed * delta
            this.angle += PIXI.RAD_TO_DEG * decelerationSpeed * delta
            if (debug) console.debug(`deceleration ${this.angle}`)
        } else {
            this.angle += 0
            this.wheel.isSpinning = false
        }
    }

    move(delta) {
        if (this.wheel.isSpinning) {
            this.spin(delta, this.wheel.spinOptions, this.debug)
        } else {
            if (this.debug) console.debug(this.angle - this.angleStart)
            this.angleStart = this.angle
        }
    }
}
