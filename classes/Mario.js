import { Animation } from './Animation.js'

export class Mario extends Animation {
    constructor(canvas, context, currentMap, spritesheet, x, y, width, height, timePerFrame, numberOfFrames, w, h) {
        super(spritesheet, x, y, width, height, timePerFrame)
        console.log(this.y)
        this.canvas = canvas
        this.context = context
        this.currentMap = currentMap
        this.level = 3
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
        this.touchedBox = null
        this.touchedBoxX = ''
        this.isJummping = false
        this.boxMaxY = 50
        this.grassMaxY = this.canvas.height / 2
        this.marioMinY = this.grassMaxY
        this.marioMaxY = 20
        this.stepSound = document.querySelector('.stepSound')
    }

    isTouchingFlag() {
        if (this.x >= 1100) {
            this.x = 0
            this.level += 1
        }
    }

    checkCollision(object, objectW, objectH) {
        let cond1 = this.x < object.x + objectW && this.x + this.w > object.x
        let cond2 = this.y < object.y + objectH && this.y + this.h > object.y
        if (cond1 && cond2) return true
    }

    isTouchingSushi() {
        this.currentMap.sushiCoordonates.forEach(sushi => {
            if (this.checkCollision(sushi, 30, 30)) sushi.collected = true

        })
    }

    isTouchingBox() {
        this.currentMap.boxCoordonates.forEach(box => {
            if (this.checkCollision(box, 50, 50)) {
                this.touchedBox = box
                // places Mario on top of the box when falling is done
                if (this.isFalling) {
                    this.marioMinY = 50
                }
                // blocks right or left movement
                this.touchedBoxX = box.x > this.x ? 'bigger' : 'smaller'
            }
        });
        console.log(this.touchedBox, 'x:', this.x, 'y :', this.y)
    }

    stay(drawMap, mapObject) {
        setTimeout(() => {
            drawMap(this.currentMap, mapObject)
            this.currentFrameSet = this.frameSet.stay
            this.moving = false
        }, 300)
    }

    makeRightSteps(mapObject, drawMap) {
        this.touchedBoxX = ''
        this.moving = true
        drawMap(this.currentMap, mapObject)
        this.currentFrameSet = this.frameSet.right
        this.x = this.isJummping ? this.x + 15 : this.x + 10.5
    }

    makeLeftSteps(mapObject, drawMap) {
        this.touchedBoxX = ''
        this.moving = true
        drawMap(this.currentMap, mapObject)
        this.currentFrameSet = this.frameSet.left
        this.x = this.isJummping ? this.x - 15 : this.x - 10.5
    }

    makeSteps(direction, mapObject, drawMap) {
        if (!this.moving) {
            let leftSteps = setInterval(() => {
                if (this.steps === 4) {
                    clearInterval(leftSteps)
                    this.steps = 0
                    this.stay(drawMap, mapObject)
                }

                if (direction === 'right' && (this.touchedBoxX !== 'bigger' || this.isJummping || this.isFalling)) {
                    if (this.touchedBox && this.x >= this.touchedBox.x) {
                        this.marioMinY = this.grassMaxY
                        this.fall(mapObject, drawMap)
                    }
                    this.makeRightSteps(mapObject, drawMap)
                    //this.stepSound.play()
                }

                if (direction === 'left' && (this.touchedBoxX !== 'smaller' || this.isJummping || this.isFalling)) {
                    if (this.touchedBox && this.x <= this.touchedBox.x) {
                        this.marioMinY = this.grassMaxY
                        this.fall(mapObject, drawMap)
                    }

                    this.makeLeftSteps(mapObject, drawMap)
                    //this.stepSound.play()
                }
                this.steps += 1

            }, 80)
        }
    }

    jump(mapObject, drawMap) {
        if (!this.isJummping) {
            this.isJummping = true
            let jumpInterval = setInterval(() => {
                if (this.y <= this.marioMaxY) {
                    this.fall(mapObject, drawMap)
                    clearInterval(jumpInterval)
                }
                drawMap(this.currentMap, mapObject)
                this.y = this.y - 10
            }, 50)
            console.log('JUMMPING')
        }
    }

    fall(mapObject, drawMap) {
        let fallInterval = setInterval(() => {
            this.isFalling = true
            this.isTouchingBox()
            if (this.y === this.marioMinY) {
                this.isJummping = false
                this.isFalling = false
                clearInterval(fallInterval)
            }

            drawMap(this.currentMap, mapObject)

            if (this.y < this.marioMinY) this.y = this.y + 10

        }, 50)
        console.log('FALLING')
    }
}