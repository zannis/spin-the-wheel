import {Application, Container, DEG_TO_RAD, Sprite, Texture} from 'pixi.js-legacy'
import {Resizable, ResizeOptionsRad} from '../types'
import {borders} from '../utils'

export default class OuterGraphics extends Container implements Resizable {
    background: Sprite
    indicators: Indicator[]
    constructor(app: Application, radius: number, slices: number) {
        super()
        this.name = 'outer'
        const _background = () => {
            const sprite = new Sprite(Texture.from('assets/outer-graphics.svg'))
            sprite.name = 'background'
            sprite.anchor.set(0.5)
            // sprite.addChild(borders(sprite))
            return sprite
        }
        const _indicators = () => {
            const result = []
            for (let i = 0; i < slices; i++) {
                const angle = 360 / slices
                result.push(new Indicator(radius, i * angle))
            }
            return result
        }

        this.background = _background()
        this.indicators = _indicators()
        this.addChild(this.background)
        this.addChild(...this.indicators)
        this.resize({ radius })
    }
    resize(options: ResizeOptionsRad): void {
        this.background.width = 2 * options.radius
        this.background.height = 2 * options.radius
        this.background.position.x = window.innerWidth / 2
        this.background.position.y = window.innerHeight / 2
        this.indicators.forEach((ind) => ind.resize({
            radius: Math.floor(options.radius * 0.93)
        }))
    }
}

class Indicator extends Sprite implements Resizable {
    constructor(radius: number, angle: number) {
        super(Texture.from('assets/slice-indicator.svg'))
        this.name = 'indicator'
        this.angle = angle
        this.anchor.set(0.5)
        this.resize({ radius })
    }
    resize(options: ResizeOptionsRad): void {
        this.position.x = (window.innerWidth / 2) + Math.cos(DEG_TO_RAD * this.angle) * options.radius
        this.position.y = (window.innerHeight / 2) + Math.sin(DEG_TO_RAD * this.angle) * options.radius
        this.width = options.radius / 10
        this.height = options.radius / 10
    }

}
