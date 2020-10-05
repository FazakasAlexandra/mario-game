import { Sprite } from './Sprite.js'
import { Database } from './Database.js'
import { GameMenu } from './GameMenu.js'
import { xy2i } from '../utilities.js'

export class MapGenerator {
    constructor(context, player, skyColor, storedMap) {
        this.context = context
        this.player = player
        this.skyColor = skyColor || '#7FBFFF'
        this.baseMap = storedMap || []
        this.remainedSushi = 0
        this.obstacles = 0
        this.mapIndex = 0
        this.w = 50
        this.h = 50
        this.tileXstart = 0
        this.tileYstart = 0
        this.db = new Database()
        this.gameMenu = new GameMenu()
    }

    renderCreateMapButton() {
        const modalButtonContainer = this.gameMenu.gameModalButton('create-map', 'CREATE MAP')
        document.querySelector('#map-generator-menu').insertAdjacentHTML('afterend', modalButtonContainer)
        document.querySelector('#create-map').classList.add('btn-secondary-outline')
        this.addCreateMapEvent()
    }

    addCreateMapEvent() {
        console.log(this, this.player.Id)
        document.querySelector('#create-map').addEventListener('click', () => {
            console.log(this.skyColor)
            this.createdMap = {
                skyColor: this.skyColor,
                remainedSushi: this.remainedSushi,
                obstacles: this.obstacles,
                json_map: this.baseMap,
                playerId: this.player.Id
            }

            this.db.postMap(this.createdMap)
                .then((res) => {
                    console.log(res.map_id)
                    Promise.allSettled([this.db.getMapByMapId(res.map_id), this.db.getMapsByPlayerId(this.player.Id)])
                        .then((res) => {
                            this.gameMenu = new GameMenu(res[0].value, res[1].value)
                            this.gameMenu.setModalBody(this.player, 'mapGenerator', this.createdMap)
                        })
                })
        })
    }

    drawBaseMap = () => {
        this.mapIndex = 0

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, this.mapIndex++) {
                this.tileXstart = x * this.w
                this.tileYstart = y * this.h

                this.makeBaseTile()

                if (localStorage.getItem('map')) {
                    this.drawStoredMap()
                } else {
                    this.baseMap.push({ gridValue: 0, img: '' })
                }
            }
        }
        this.storeMap()
        this.addBaseTileEvent()
    }

    storeMap(map = this.baseMap) {
        localStorage.setItem('map', JSON.stringify(map))
    }

    updateStoredMap(chosenIndex) {
        const storedMap = JSON.parse(localStorage.getItem('map'))
        storedMap[chosenIndex] = this.baseMap[chosenIndex]
        this.storeMap(storedMap)

    }

    drawStoredMap() {
        if (this.baseMap[this.mapIndex] !== 0) {
            this.drawSprite(this.baseMap[this.mapIndex].img)
        }
    }

    makeBaseTile = () => {
        this.setBaseTileFill()
        this.setBaseTileBorder()
    }

    setBaseTileFill = () => {
        this.context.fillStyle = this.skyColor;
        this.context.fillRect(this.tileXstart, this.tileYstart, 50, 50)
    }

    setBaseTileBorder() {
        this.context.beginPath();
        this.context.lineWidth = "0.2";
        this.context.strokeStyle = "black";
        this.context.rect(this.tileXstart, this.tileYstart, 50, 50);
        this.context.stroke();
    }

    updateBaseMap = (chosenIndex, isSelection) => {
        if (isSelection) {
            this.baseMapLoop(chosenIndex, this.drawSprite)

        } else {
            this.baseMapLoop(chosenIndex, this.makeBaseTile)
        }
    }

    drawSprite = (image) => {
        const sprite = new Sprite(image, this.context)
        sprite.drawSpriteOnImageLoad(this.tileXstart, this.tileYstart)
    }


    baseMapLoop = (chosenIndex, updateAcction) => {
        this.mapIndex = 0
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, this.mapIndex++) {
                this.tileXstart = x * this.w
                this.tileYstart = y * this.h

                if (this.mapIndex === chosenIndex) {
                    updateAcction(this.baseMap[chosenIndex].img)
                }
            }
        }
    }

    addBaseTileEvent = () => {
        this.context.canvas.addEventListener('click', (event) => {
            const chosenIndex = this.getBaseMapIndex(event)

            if (document.querySelector('.selected')) {
                this.baseMap[chosenIndex].gridValue = document.querySelector('.selected').getAttribute('grid-value')
                this.baseMap[chosenIndex].img = document.querySelector('.selected').getAttribute('src')

                this.isSushiChosen(chosenIndex, 'add')
                this.isObstacleChosen(chosenIndex, 'add')

                this.updateStoredMap(chosenIndex)
                this.updateBaseMap(chosenIndex, true)

            } else {
                this.baseMap[chosenIndex].gridValue = 0
                this.baseMap[chosenIndex].img = ''

                this.isSushiChosen(chosenIndex, 'remove')
                this.isObstacleChosen(chosenIndex, 'remove')

                this.updateStoredMap(chosenIndex)
                this.updateBaseMap(chosenIndex, false)
            }
        })
    }

    isSushiChosen(chosenIndex, action) {
        if (this.baseMap[chosenIndex].gridValue === '2') {
            if (action === 'add') {
                this.remainedSushi += 1
                return
            }

            this.remainedSushi -= 1
        }
    }

    isObstacleChosen(chosenIndex, action) {
        if (this.baseMap[chosenIndex].gridValue === '4') {
            if (action === 'add') {
                this.obstacles += 1
                return
            }
            this.obstacles -= 1
        }
    }

    getBaseMapIndex(event) {
        return xy2i(Math.floor(event.clientX / 50),
            Math.floor(event.clientY / 50),
            24)
    }
}