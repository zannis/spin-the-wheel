import * as PIXI from 'pixi.js-legacy'

export function borders(element: PIXI.DisplayObject) {
    const result = new PIXI.Graphics()
    const bounds = element.getBounds()
    // const bounds = element.getLocalBounds()
    result
        .lineStyle(4, 0x243343)
        .moveTo(bounds.x, bounds.y)
        .lineTo(bounds.x, bounds.y + bounds.height)
        .lineTo(bounds.x + bounds.width, bounds.y + bounds.height)
        .lineTo(bounds.x + bounds.width, bounds.y)
        .lineTo(bounds.x, bounds.y)
    return result
}
