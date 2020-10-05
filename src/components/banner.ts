import { Container, Sprite, Texture } from 'pixi.js-legacy'
import { Resizable, ResizeOptionsRad } from '../types'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'

export default class Banner extends Container implements Resizable {
    private readonly banner: Sprite
    private readonly pin: Sprite
    private readonly positionAngle: number

    constructor(radius: number, angle: number) {
        super()
        this.name = 'banner'
        this.positionAngle = angle
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
        // this.pivot.set(0.5)
        // this.angle = 60
    }
    getAngle(): number {
        return this.position.x
    }
}
