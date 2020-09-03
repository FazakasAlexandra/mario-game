import { Animation } from './Animation.js'

export class Mario extends Animation {
    constructor(canvas, context, currentMap, spritesheet, x, y, width, height, timePerFrame, numberOfFrames, w, h) {
        super(spritesheet, x, y, width, height, timePerFrame)
        this.canvas = canvas
        this.context = context
        this.currentMap = currentMap
        this.level = 2
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

    isTouchingFlag(){
        if(this.x >= 1100){
            this.x = 0
            this.level += 1
        }
    }

    isTouchingSushi(){
        this.currentMap.sushiCoordonates.forEach(sushi => {
            let cond1 = this.x < sushi.x + 30 && this.x + this.w > sushi.x
            let cond2 = this.y < sushi.y + 30 && this.y + this.h > sushi.y
            if(cond1 && cond2){
                sushi.collected = true
                console.log('MARIO IS TOUCHING SUSHI')
            }
        });
    }

    stay(drawMap, mapObject) {
        setTimeout(() => {
            drawMap(this.currentMap, mapObject)
            this.currentFrameSet = this.frameSet.stay
            this.moving = false
        }, 300)
    }

    makeSteps(direction, mapObject, drawMap) {
        if (!this.moving) {
            let leftSteps = setInterval(() => {
                if (this.steps === 4) {
                    clearInterval(leftSteps)
                    this.steps = 0
                    this.stay(drawMap, mapObject)
                }
                if (direction === 'right') {
                    this.moving = true
                    drawMap(this.currentMap, mapObject)
                    this.currentFrameSet = this.frameSet.right
                    this.x = this.x + 10.5
                }

                if (direction === 'left') {
                    this.moving = true
                    drawMap(this.currentMap, mapObject)
                    this.currentFrameSet = this.frameSet.left
                    this.x = this.x - 10.5
                }
                this.steps += 1
            }, 80)
        }
    }
}