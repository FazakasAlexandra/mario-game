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
        this.touchesBox = false
        this.onTopOfBox = false
        this.touchedBox = null
        this.touchedBoxX = ''
        this.touchedBoxY = ''
        this.isJummping = false
        this.fallingPosition = this.canvas.height / 2
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
        if (cond1 && cond2) {
            return true
        }
    }

    isTouchingSushi() {
        this.currentMap.sushiCoordonates.forEach(sushi => {
            if (this.checkCollision(sushi, 30, 30)) {
                sushi.collected = true
                console.log('MARIO IS TOUCHING SUSHI')
            }
        });
    }

    isTouchingBox() {
        this.currentMap.boxCoordonates.forEach(box => {
            if (this.checkCollision(box, 50, 50)) {
                this.touchedBox = box
                if(!this.isFalling || !this.isJummping){
                    this.touchesBox = true
                }
                // case collision & falling : place mario on top of the box
                if(this.isFalling){
                   this.fallingPosition = 50
                }
                this.touchedBoxX = box.x > this.x ? 'bigger' : 'smaller'
                this.touchedBoxY = box.y > this.y ? 'bigger' : '' 
                console.log('MARIO IS TOUCHING BOX')
            }
        });
        //y = 85 -> mario on top
        console.log(this.touchedBox,'x:', this.x, 'y :', this.y)
        console.log(this.touchesBox)
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

                if(this.touchedBoxX !== 'bigger' || this.isJummping || this.isFalling){
                    if (direction === 'right') {
                        this.touchedBoxX = ''
                        this.moving = true
                        console.log(this.x)
                        drawMap(this.currentMap, mapObject)
                        this.currentFrameSet = this.frameSet.right
                        this.x = this.isJummping ? this.x + 15: this.x + 10.5
                        //this.stepSound.play()
                    }
                }

                if(this.touchedBoxX !== 'smaller' || this.isJummping || this.isFalling){
                    if (direction === 'left') {
                        this.touchedBoxX = ''
                        this.moving = true
                        console.log(this.x)
                        drawMap(this.currentMap, mapObject)
                        this.currentFrameSet = this.frameSet.left
                        this.x = this.isJummping ? this.x - 15: this.x - 10.5
                        //this.stepSound.play()
                    }
                }
                this.steps += 1

            }, 80)
        }
    }

    jump(mapObject, drawMap){
        if(!this.isJummping){
            this.isJummping = true
            let jumpInterval = setInterval(()=>{
                if(this.y <= 20){
                    this.fall(mapObject, drawMap)
                    clearInterval(jumpInterval)
                }
                drawMap(this.currentMap, mapObject)
                this.y = this.y - 10
            }, 50)
            console.log('JUMMPING')
        }
    }

    fall(mapObject, drawMap){
            let fallInterval = setInterval(()=>{
                this.isFalling = true
                if(this.y === this.fallingPosition){
                    this.isJummping = false
                    this.isFalling = false
                    clearInterval(fallInterval)
                }
                drawMap(this.currentMap, mapObject)
                if(this.y < this.fallingPosition){
                    // place Mario on the box
                    this.isTouchingBox()
                    // place Mario on the ground
                    this.y = this.y + 10
                }
            }, 50)
            console.log('FALLING')
    }
}