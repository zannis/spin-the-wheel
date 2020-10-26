import { utils, Application, Container, Sprite } from 'pixi.js-legacy'
import Wheel from './components/wheel'
import { WheelOptions } from './types'

declare global {
    interface Window {
        wheel: { state: string, spin(): void; init(config: WheelOptions): void }
    }
}

utils.skipHello()
window.addEventListener('DOMContentLoaded', () => {
    const app = new Application({
        resizeTo: window,
        antialias: true,
        transparent: true,
    })
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        const wheel = app.stage.getChildByName('wheel')
        if (wheel instanceof Wheel) wheel.resize({ width: window.innerWidth, height: window.innerHeight })
    }
    document.getElementById('wpin-the-wheel').appendChild(app.view)
    // load the texture we need
    app.loader.load(() => {
        const stage: Container = app.stage
        stage.name = 'stage'

        const _wheel = (wheelOptions: WheelOptions) => {
            const TEST_OPTIONS: WheelOptions = {
                radius: Math.floor((Math.min(window.innerWidth, window.innerHeight) / 2) * 0.9),
                slices: 16,
                winningCopy: 'GET 10% OFF',
                placeholderCopies: ['text1', 'text2', 'text3'],
            }
            return new Wheel(wheelOptions || TEST_OPTIONS)
        }

        const _button = () => {
            const button = Sprite.from('assets/button.svg')
            button.width = 100
            button.height = 50
            button.x = 50
            button.y = 50
            button.interactive = true
            button.buttonMode = true
            button.on('click', () => {
                button.interactive = false
                const wheel = <Wheel>stage.getChildAt(0)
                if (!wheel.isSpinning && !wheel.hasSpinned) {
                    wheel.spin()
                }
            })
            return button
        }

        window.wheel = {
            state: 'created',
            spin: () => {
                if (window.wheel.state === 'initialized') {
                    const wheel = <Wheel>stage.getChildByName('wheel')
                    if (!wheel.isSpinning && !wheel.hasSpinned) {
                        wheel.spin()
                    }
                }
            },
            init: (config, debug = false) => {
                stage.addChild(_wheel(config))
                if (debug) stage.addChild(_button())
                window.wheel.state = 'initialized'
            },
        }
        // stage.addChild(borders(stage))
        app.ticker.add((delta) => {
            const wheel = stage.getChildByName('wheel')
            if (wheel instanceof Wheel) wheel.move(delta)
            else console.warn(`wheel was a(n) ${typeof wheel}. ${JSON.stringify(wheel.name)}`)
        })
    })
    window.addEventListener('resize', resize, false)
})
