import { Animation } from './Animation.js'
import { Database } from './Database.js'

export class Mario extends Animation {
    constructor(canvas, context, currentMap, spritesheet, x, y, width, height, timePerFrame, numberOfFrames, w, h, player) {
        super(spritesheet, x, y, width, height, timePerFrame)
        this.name = player.Name
        this.level = player.Level
        this.sushi = player.Sushi
        this.database = new Database()
        this.canvas = canvas
        this.context = context
        this.currentMap = currentMap
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
        this.movementRestriction = {
            right: false,
            left: true
        }
        this.isJummping = false
        this.onTopOfBox = false
        this.boxMaxY = 75
        this.grassMaxY = this.canvas.height / 2
        this.marioMinY = this.grassMaxY
        this.marioMaxY = 20
        this.stepSound = document.querySelector('.stepSound')
    }

    isTouchingFlag() {
        if (this.x >= 1100) {
            this.x = 0
            this.level += 1
            this.database.upadatePlayerLevel(this.name, this.level)
        }
    }

    checkCollision(object, objectW, objectH) {
        let cond1 = this.x < object.x + objectW && this.x + this.w > object.x
        let cond2 = this.y < object.y + objectH && this.y + this.h > object.y
        if (cond1 && cond2) return true
    }

    isTouchingSushi() {
        this.currentMap.sushiCoordinates.forEach(sushi => {
            if (this.checkCollision(sushi, 30, 30)) {
                sushi.collected = true
                this.sushi += 1
                document.getElementById('sushiNumbers').innerText = this.sushi
                this.database.upadatePlayerSushi(this.name, this.sushi)
            }
        })
    }

    stay(drawMap, mapObject) {
        setTimeout(() => {
            drawMap(this.currentMap, mapObject)
            this.currentFrameSet = this.frameSet.stay
            this.moving = false
        }, 300)
    }

    makeRightSteps(mapObject, drawMap) {
        this.movementRestriction.left = false
        this.moving = true
        drawMap(this.currentMap, mapObject)
        this.currentFrameSet = this.frameSet.right
        this.x = this.isJummping ? this.x + 15 : this.x + 10.5
    }

    makeLeftSteps(mapObject, drawMap) {
        this.movementRestriction.right = false
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

                if (direction === 'right' && (!this.movementRestriction.right || this.isJummping || this.onTopOfBox)) {
                    if (this.touchedBox && this.x > this.touchedBox.x) {
                        this.fallFromBox(mapObject, drawMap)
                    }
                    this.makeRightSteps(mapObject, drawMap)
                    //this.stepSound.play()
                }

                if (direction === 'left' && (!this.movementRestriction.left || this.isJummping || this.onTopOfBox)) {
                    if (this.touchedBox && this.x < this.touchedBox.x) {
                       
                        this.fallFromBox(mapObject, drawMap)
                    }
                    this.makeLeftSteps(mapObject, drawMap)
                    //this.stepSound.play()
                }
                this.steps += 1

            }, 80)
        }
    }

    fallFromBox(mapObject, drawMap) {
        this.onTopOfBox = false
        this.touchedBox = null
        this.marioMinY = this.grassMaxY
        this.movementRestriction.left = false
        this.movementRestriction.right = false
        this.fall(mapObject, drawMap)
    }

    jump(mapObject, drawMap) {
        if (!this.isJummping) {
            this.isJummping = true
            let jumpInterval = setInterval(() => {
                if (this.y < this.marioMaxY) {
                    this.fall(mapObject, drawMap)
                    clearInterval(jumpInterval)
                }
                drawMap(this.currentMap, mapObject)
                this.y = this.y - 10
            }, 50)
        }
    }

    setMovementRestriction(box) {
            if (box.x > this.x) {
                this.movementRestriction.right = true
            }
    
            if (box.x < this.x) {
                this.movementRestriction.left = true
            }
    }

    isTouchingBox() {
        let touching = false
        this.currentMap.boxCoordinates.forEach(box => {
            if (this.checkCollision(box, 50, 50)) {
                this.touchedBox = box
                touching = true
                this.setMovementRestriction(box)
            }
        });
        return touching
    }

    isfallingOnBox() {
        // falls on box or not
        if (this.isTouchingBox()) {
            this.marioMinY = this.boxMaxY
        }
    }


    fall(mapObject, drawMap) {
        this.isFalling = true

        let fallInterval = setInterval(() => {
            if (this.level === 3) this.isfallingOnBox()

            if (this.y === this.marioMinY) {
                if(this.marioMinY === this.boxMaxY){
                    this.onTopOfBox = true
                }
                console.log('clear')
                this.isJummping = false
                this.isFalling = false
                clearInterval(fallInterval)
            }

            drawMap(this.currentMap, mapObject)

            if (this.y < this.marioMinY) this.y = this.y + 10

        }, 50)
    }
}