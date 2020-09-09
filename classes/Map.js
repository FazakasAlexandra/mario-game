import { Sprite } from './Sprite.js'
import { Database } from './Database.js'

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
        this.tileX = 0
        this.tileY = 0
    }

    makeMapModels(maps,self){
        maps.forEach((map, i) => {
            let strArr = map.grid.split(",")
            let nrArr = self.getNumbersArr(strArr)
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
                boxCoordonates: [],
                sushiCoordonates: [],
                remainedSushi : map.remainedSushi,
                flagCoordonates: {
                    x: null,
                    y: null
                }
            })
        });
    }

    getNumbersArr(strArr, nrArr = []){
        strArr.forEach(el => {
            el.trim()
            nrArr.push(+el)
        })
        return nrArr
    }
    
    drawMap(map, self = this) {
        self.mapIndex = 0

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, self.mapIndex++) {
                self.tileX = x * self.w
                self.tileY = y * self.h

                switch (map.level) {
                    case 1:
                        self.drawFirstMap(map.grid[self.mapIndex], map, self)
                        break

                    case 2:
                        self.drawSecondMap(map.grid[self.mapIndex], map, self)
                        break

                    case 3:
                        self.drawThirdMap(map.grid[self.mapIndex], map, self)
                }
            }
        }
    }

    drawFirstMap(tile, map, self) {
        switch (tile) {
            case 0:
                this.makeSkyTile(self, map)

                if (Math.floor(Math.random() < 0.05)) {
                    map.cloud.drawSprite(self.tileX, self.tileY)
                }
                break

            case 1:
                map.grass.drawSprite(self.tileX, self.tileY)
                break

            case 3:
                this.makeSkyTile(self, map)
                map.flag.drawSprite(self.tileX - 20, self.tileY)
                map.flagCoordonates.x = self.tileX
                map.flagCoordonates.y = self.tileY
                break
        }
    }

    drawSecondMap(tile, map, self) {
        switch (tile) {
            case 0:
                self.makeSkyTile(self, map)
                break

            case 1:
                map.grass.drawSprite(self.tileX, self.tileY)
                break

            case 2:
                self.makeSkyTile(self, map)
                self.removeCollectedItems(map, map.sushiCoordonates)
                map.sushi.drawSprite(self.tileX, self.tileY + 15)
                if (map.sushiCoordonates.length < map.remainedSushi) {
                    map.sushiCoordonates.push({ x: self.tileX, y: self.tileY, index: self.mapIndex })
                }
                break

            case 3:
                self.makeSkyTile(self, map)
                map.flag.drawSprite(self.tileX - 20, self.tileY)
                map.flagCoordonates.x = self.tileX
                map.flagCoordonates.y = self.tileY

                break
        }
    }

    drawThirdMap(tile, map, self) {
        switch (tile) {
            case 0:
                self.makeSkyTile(self, map)
                break
            case 1:
                map.grass.drawSprite(self.tileX, self.tileY)
                break
            case 2:
                self.makeSkyTile(self, map)
                self.removeCollectedItems(map, map.sushiCoordonates)
                map.sushi.drawSprite(self.tileX, self.tileY + 15)
                if (map.sushiCoordonates.length !== map.remainedSushi) {
                    map.sushiCoordonates.push({ x: self.tileX, y: self.tileY, index: self.mapIndex })
                }
                break
            case 3:
                self.makeSkyTile(self, map)
                map.flag.drawSprite(self.tileX - 20, self.tileY)
                map.flagCoordonates.x = self.tileX
                map.flagCoordonates.y = self.tileY
                break
            case 4:
                map.box.drawSprite(self.tileX, self.tileY)
                map.boxCoordonates.push({ x: self.tileX, y: self.tileY, index: self.mapIndex })
                break
        }

    }

    makeSkyTile(self, map) {
        self.context.fillStyle = map.skyColor
        self.context.fillRect(self.tileX, self.tileY, 50, 50);
    }

    removeCollectedItems(map, coordonates, i = 0) {
        if (i === coordonates.length || coordonates.length === 0) {
            return
        }

        if (coordonates[i].collected) {
            map.grid[coordonates[i].index] = 0
            coordonates.splice(i, 1)
            map.remainedSushi -= 1
            return this.removeCollectedItems(map, coordonates, i)
        }

        return this.removeCollectedItems(map, coordonates, i + 1)
    }
}