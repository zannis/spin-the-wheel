import { Container, Graphics } from 'pixi.js-legacy'

export function borders(element: Container | Graphics) {
    const result = new Graphics()
    // const bounds = element.getBounds()
    const elementBounds = {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
    }
    // console.log(element.name, elementBounds)
    result
        .lineStyle(4, 0x243343)
        .moveTo(elementBounds.x, elementBounds.y)
        .lineTo(elementBounds.x, elementBounds.y + elementBounds.height)
        .lineTo(elementBounds.x + elementBounds.width, elementBounds.y + elementBounds.height)
        .lineTo(elementBounds.x + elementBounds.width, elementBounds.y)
        .lineTo(elementBounds.x, elementBounds.y)
    return result
}

export const MIN_SLICES = 3
export const MAX_SLICES = 16
