import { Animation } from './Animation.js'

export class Mario extends Animation {
    constructor(canvas, context, spritesheet, x, y, width, height, timePerFrame, numberOfFrames, w, h) {
        super(spritesheet, x, y, width, height, timePerFrame)
        this.canvas = canvas
        this.context = context
        this.level = 0
        this.drawAnimates = super.drawAnimated
        this.update = super.update
        this.w = w
        this.h = h
        this.numberOfFrames = numberOfFrames
        this.frameSet = {
            stay: [0, 0, 0, 0],
            left: [4, 5, 6, 7],
            right: [8, 9, 10, 11],
        }
        this.currentFrameSet = [0, 0, 0, 0]
        this.currentFrame = 0
        this.steps = 0
        this.moving = false
    }

    isOutsideCanvas() {
        if (this.x >= canvas.width) {
            this.x = -20
            this.level += 1
        }
    }

    stay(drawMap, map) {
        setTimeout(() => {
            drawMap(map)
            this.currentFrameSet = this.frameSet.stay
            this.moving = false
        }, 300)
    }

    makeSteps(direction, map, drawMap) {
        console.log(map, drawMap)
        if (!this.moving) {
            let leftSteps = setInterval(() => {
                if (this.steps === 4) {
                    clearInterval(leftSteps)
                    this.steps = 0
                    this.stay(drawMap, map)
                }
                if (direction === 'right') {
                    this.moving = true
                    drawMap(map)
                    this.currentFrameSet = this.frameSet.right
                    this.x = this.x + 10.5
                }

                if (direction === 'left') {
                    this.moving = true
                    drawMap(map)
                    this.currentFrameSet = this.frameSet.left
                    this.x = this.x - 10.5
                }
                this.steps += 1
            }, 80)
        }
    }
}