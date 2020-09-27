import { Application, Container, Graphics } from 'pixi.js-legacy'

export interface WheelOptions {
    radius: number
    slices: number
    winningCopy: string
    placeholderCopies: string[]
}

export interface SpinOptions {
    totalDuration: number
    accelerationDuration: number
    maxSpeed: number
}

export interface Resizable {
    resize(options: ResizeOptionsWH | ResizeOptionsRad): void
}

export interface ResizeOptionsWH {
    width: number
    height: number
}

export interface ResizeOptionsRad {
    radius: number
}

export interface Wheel extends Container {
    readonly winningSliceIndex: number
    slices: WheelSlice[]
    spinOptions: SpinOptions
    spinStart: number
    isSpinning: boolean
    move(delta: number): void
    spin(forcedIndex: number): void
    resize(width: number, height: number): void
    new (app: Application, name: string, options: WheelOptions): Wheel
}

export interface WheelSlice extends Graphics {
    readonly debug: boolean
    wheel: Wheel
    angleStart: number
    spin(delta: number, options: SpinOptions, debug: boolean): void
    move(delta: number): void
    resize(width: number, height: number): void
    new (app: Application, radius: number, color: number, lineColor: number, angle: number, angleOffset: number, copy?: string, debug?: boolean): WheelSlice
}
