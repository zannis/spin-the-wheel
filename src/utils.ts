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

export function normalizedRadius(value: number) {
    return Math.min(value, Math.min(Math.floor(window.innerWidth / 2), window.innerHeight / 2) * 0.9)
}

export const MIN_SLICES = 3
export const MAX_SLICES = 16
export const DEFAULT_DURATION = 5000
export const DEFAULT_ACCELERATION_DURATION = 2000
export const DEFAULT_MAX_SPEED = 0.2
