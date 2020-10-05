import Wheel from '../../../components/wheel'
import { Application } from 'pixi.js-legacy'
import {WheelOptions} from '../../../types'
import { MAX_SLICES, MIN_SLICES } from '../../../utils'

describe('Wheel class', function () {
    let app: Application
    let options: WheelOptions

    beforeAll(() => {
        app = new Application()
        options = {
            radius: 200,
            slices: 10,
            placeholderCopies: ['test'],
            winningCopy: 'win',
        }
    })

    beforeEach(() => {
        jest.restoreAllMocks()
    })

    it('should instantiate a wheel with 10 slices correctly', () => {
        options.slices = 10
        const actual = new Wheel(app, options)
        expect(actual).toBeInstanceOf(Wheel)
        expect(actual.slices.length).toBe(10)
    })
    it('should instantiate a wheel with less than MIN_SLICES slices correctly', () => {
        options.slices = MIN_SLICES - 1
        const actual = new Wheel(app, options)
        expect(actual).toBeInstanceOf(Wheel)
        expect(actual.slices.length).toBe(MIN_SLICES)
    })
    it('should instantiate a wheel with more than MAX_SLICES slices correctly', () => {
        options.slices = MAX_SLICES + 1
        const actual = new Wheel(app, options)
        expect(actual).toBeInstanceOf(Wheel)
        expect(actual.slices.length).toBe(MAX_SLICES)
    })
    it('should call spin if wheel is spinning for the first time', () => {
        options.slices = 10
        const actual = new Wheel(app, options)
        const moveSpy = jest.spyOn(actual, 'move')
        actual.isSpinning = true
        actual.move(10)
        expect(moveSpy).toHaveBeenCalledTimes(1)
    })
    xit('should not call move if wheel has already spinned', () => {
        options.slices = 10
        const actual = new Wheel(app, options)
        const moveSpy = jest.spyOn(actual, 'move')
        actual.isSpinning = true
        actual.hasSpinned = true
        actual.move(10)
        expect(moveSpy).toHaveBeenCalledTimes(0)
    })
    it('should calculate the correct distance when spinning', () => {
        options.slices = 10
        const actual = new Wheel(app, options)
        actual.spin()
    })
})
