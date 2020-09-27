import { Sprite, Texture } from 'pixi.js-legacy'
import { Resizable, ResizeOptionsRad } from '../types'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'

export default class CenterGraphics extends Sprite implements Resizable {
    constructor(radius: number) {
        super(Texture.from('assets/center-graphics.svg'))
        this.name = 'center'
        this.anchor.set(0.5)
        this.filters = [
            new DropShadowFilter({
                rotation: 90,
                distance: 10,
            }),
        ]
        this.resize({ radius })
    }
    resize(options: ResizeOptionsRad): void {
        this.width = options.radius * 0.6
        this.height = options.radius * 0.6
        this.position.x = window.innerWidth / 2
        this.position.y = window.innerHeight / 2
    }
}
