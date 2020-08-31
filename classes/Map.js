import { Sprite } from './Sprite.js'

export class Map {
    constructor(context) {
        // 50 px each tile
        this.context = context
        this.grass = new Sprite('./assets/objects/grass3.png', this.context)
        this.sushi = new Sprite('./assets/objects/sushi.png', this.context)
        this.cloud = new Sprite('./assets/objects/cloud.png', this.context)
        this.map = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ]
        this.mapIndex = 0
        this.w = 50
        this.h = 50
        this.tileX = 0
        this.tileY = 0
        this.mapFunction = this.drawMap
    }

    drawMap(map) {
        let self = map || this
        
        self.mapIndex = 0
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, self.mapIndex++) {
                self.tileX = x * self.w
                self.tileY = y * self.h

                if (self.map[self.mapIndex] === 0) {
                    self.context.fillStyle = "#66b3ff";
                    self.context.fillRect(self.tileX, self.tileY, 50, 50);

                    if (Math.floor(Math.random() < 0.05)) {
                        self.cloud.drawSprite(self.tileX, self.tileY)
                    }
                }

                if (self.map[self.mapIndex] === 1) {
                    self.grass.drawSprite(self.tileX, self.tileY)
                }
            }
        }
    }

    makeBackground(map){
        map.context.fillStyle = "#87CEFA"
        map.context.fillRect(0,0,canvas.width,210)
    
        map.context.fillStyle = "#63c900"
        map.context.fillRect(0,210,canvas.width,210)
        map.makePath(map)
    }

    makePath(map) {
        map.context.beginPath()
        map.context.moveTo(0, 210)
        map.context.lineTo(canvas.width, 210)
        map.context.lineWidth = 2
        map.context.stroke()
        
    }

    drawSecoundMap(map){
        map = map || this
        map.makeBackground(map)
    }


}