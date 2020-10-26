import { borders } from '../../utils'
import { Sprite, Texture, utils } from '../../pixi'

describe('utils', () => {
    beforeAll(() => {
        utils.skipHello()
    })

    describe('borders', () => {
        it('should draw a border around a rectangle correctly', () => {
            const rectangle = new Sprite(Texture.from('../../assets/button'))
            rectangle.position.x = 10
            rectangle.position.y = 10
            rectangle.height = 50
            rectangle.width = 50

            const actual = borders(rectangle)

            expect(actual.position.x).toBe(0)
            expect(actual.position.y).toBe(0)
            expect(actual.height).toBe(60)
            expect(actual.width).toBe(60)
        })
    })
})
