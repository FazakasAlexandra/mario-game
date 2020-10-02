import { Sprite } from './Sprite.js'
import { Database } from './Database.js'
import { getNumbersArr } from '../utilities.js'

export class Map {
    constructor(context) {
        this.context = context
        this.database = new Database()
        this.database.getMaps(this.makeMapModels, this)
        this.mapModels = []
        this.currentMap = this.mapModels.firstMap
        this.mapIndex = 0
        this.w = 50
        this.h = 50
        this.tileXstart = 0
        this.tileYstart = 0
    }

    makeMapModels(maps, self) {
        maps.forEach((map, i) => {
            let strArr = map.grid.split(",")
            let nrArr = getNumbersArr(strArr)
            maps[i].grid = nrArr

            self.mapModels.push({
                level: map.level,
                grid: map.grid,
                skyColor: map.skyColor,
                grass: new Sprite(map.grass, self.context),
                box: new Sprite(map.box, self.context),
                sushi: new Sprite(map.sushi, self.context, 30, 30),
                flag: new Sprite(map.flag, self.context, 70, 70),
                cloud: map.cloud ? new Sprite(map.cloud, self.context) : null,
                boxCoordinates: [],
                sushiCoordinates: [],
                remainedSushi: map.remainedSushi,
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

                switch (map.grid[self.mapIndex]) {
                    case 0:
                        if (map.level === 1) {
                            if (Math.floor(Math.random() < 0.05)) {
                                map.cloud.drawSprite(self.tileXstart, self.tileYstart)
                            }
                        }
                        break

                    case 1:
                        map.grass.drawSprite(self.tileXstart, self.tileYstart)
                        break

                    case 2:
                        self.removeCollectedItems(map, 'sushiCoordinates')
                        map.sushi.drawSprite(self.tileXstart, self.tileYstart + 15)
                        if (map.sushiCoordinates.length < map.remainedSushi) {
                            map.sushiCoordinates.push({ x: self.tileXstart, y: self.tileYstart, index: self.mapIndex })
                        }
                        break

                    case 3:
                        map.flag.drawSprite(self.tileXstart - 20, self.tileYstart)
                        map.flagCoordinates.x = self.tileXstart
                        map.flagCoordinates.y = self.tileYstart
                        break

                    case 4:
                        map.box.drawSprite(self.tileXstart, self.tileYstart)
                        map.boxCoordinates.push({ x: self.tileXstart, y: self.tileYstart, index: self.mapIndex })
                        break
                }

            }
        }
    }


    makeSkyTile(self, map) {
        self.context.fillStyle = map.skyColor
        self.context.fillRect(self.tileXstart, self.tileYstart, 50, 50);
    }

    removeCollectedItems(map, coordType) {
        map[coordType] = map[coordType].filter(item => {
            if (item.collected) {
                map.grid[item.index] = 0
                map.remainedSushi--
            } else return item
        })
    }
}