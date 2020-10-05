import { Sprite } from './Sprite.js'
import { Database } from './Database.js'

export class Map {
    constructor(context) {
        this.context = context
        this.database = new Database()
        this.database.getMaps(this.makeMapModels, this)
        this.mapModels = []
        this.mapIndex = 0
        this.w = 50
        this.h = 50
        this.tileXstart = 0
        this.tileYstart = 0
    }

    makeMapModels(maps, self) {
        maps.forEach((map) => {
            self.mapModels.push({
                level: map.level,
                json_map: map.json_map,
                skyColor: map.skyColor,
                boxCoordinates: [],
                sushiCoordinates: [],
                remainedSushi: map.remainedSushi,
                obstacles: map.obstacles,
                flagCoordinates: {
                    x: null,
                    y: null
                }
            })
        });
    }

    drawMap(map, self = this) {
        self.mapIndex = 0

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, self.mapIndex++) {
                self.tileXstart = x * self.w
                self.tileYstart = y * self.h

                self.makeSkyTile(self, map)

                switch (+map.json_map[self.mapIndex].gridValue) {
                    case 1:
                        self.drawSprite(self, map, self.tileXstart, self.tileYstart)
                        
                        break

                    case 2:
                        self.removeCollectedItems(map, 'sushiCoordinates')

                        self.drawSprite(self, map, self.tileXstart, self.tileYstart + 15, 30, 30)

                        if (map.sushiCoordinates.length < map.remainedSushi) {
                            map.sushiCoordinates.push({ x: self.tileXstart, y: self.tileYstart, index: self.mapIndex })
                        }

                        break

                    case 3:
                        self.drawSprite(self, map, self.tileXstart - 20, self.tileYstart)
                        map.flagCoordinates.x = self.tileXstart
                        map.flagCoordinates.y = self.tileYstart

                        break

                    case 4:
                        console.log('object 4')
                        self.drawSprite(self, map, self.tileXstart, self.tileYstart)
                        if(map.boxCoordinates.length < map.obstacles)
                        map.boxCoordinates.push({ x: self.tileXstart, y: self.tileYstart, index: self.mapIndex })
                        
                        break
                }

            }
        }
    }

    drawSprite(self, map, tileXstart, tileYstart, w, h) {
        const sprite = new Sprite(map.json_map[self.mapIndex].img, self.context, w, h)
        sprite.drawSprite(tileXstart, tileYstart)
    }


    makeSkyTile(self, map) {
        console.warn(map.skyColor)
        self.context.fillStyle = map.skyColor
        self.context.fillRect(self.tileXstart, self.tileYstart, 50, 50);
    }

    removeCollectedItems(map, coordType) {
        map[coordType] = map[coordType].filter(item => {
            if (item.collected) {
                map.json_map[item.index].gridValue = 0
                map.remainedSushi--
            } else return item
        })
    }
}