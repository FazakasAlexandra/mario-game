import { Sprite } from './Sprite.js'

export class Map {
    constructor(context) {
        // 50 px each tile
        this.context = context
        this.mapModels = {
            firstMap: {
                level: 1,
                grid: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                grass: new Sprite('./assets/objects/grass3.png', this.context),
                cloud: new Sprite('./assets/objects/cloud.png', this.context),
                flag: new Sprite('./assets/objects/flag.png', this.context, 70, 70),
                skyColor: "#66b3ff",
                flagCoordonates: {
                    x: null,
                    y: null
                }

            },
            secondMap: {
                level: 2,
                grid: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 3,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                grass: new Sprite('./assets/objects/grass2.png', this.context),
                sushi: new Sprite('./assets/objects/sushi.png', this.context, 30, 30),
                flag: new Sprite('./assets/objects/flag.png', this.context, 70, 70),
                skyColor: '#A0D8FB',
                flagCoordonates: {
                    x: null,
                    y: null
                },
                sushiCoordonates: [],
                remainedSushi: 4
            },
            thirdMap: {
                level: 3,
                grid: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 4, 0, 0, 2, 4, 0, 0, 0, 0, 0, 4, 4, 4, 0, 2, 0, 0, 0, 0, 3,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                grass: new Sprite('./assets/objects/grass2.png', this.context),
                sushi: new Sprite('./assets/objects/sushi.png', this.context, 30, 30),
                flag: new Sprite('./assets/objects/flag.png', this.context, 70, 70),
                box: new Sprite('./assets/objects/wood.png', this.context),
                skyColor: '#66b3ff',
                flagCoordonates: {
                    x: null,
                    y: null
                },
                sushiCoordonates: [],
                boxCoordonates: [] ,
                remainedSushi: 5
            }
        }
        this.currentMap = this.mapModels.firstMap
        this.mapIndex = 0
        this.w = 50
        this.h = 50
        this.tileX = 0
        this.tileY = 0
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
        console.log(tile)
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
                self.removeCollectedItems(map, map.sushiCoordonates, map.remainedSushi)
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
                self.removeCollectedItems(map, map.sushiCoordonates, map.remainedSushi)
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

    removeCollectedItems(map, coordonates, remainedItems, i = 0) {
        if (i === coordonates.length || coordonates.length === 0) {
            return
        }

        if (coordonates[i].collected) {
            map.grid[coordonates[i].index] = 0
            coordonates.splice(i, 1)
            remainedItems -= 1
            return this.removeCollectedItems(map, coordonates, remainedItems, i)
        }

        return this.removeCollectedItems(map, coordonates, remainedItems, i + 1)
    }
}