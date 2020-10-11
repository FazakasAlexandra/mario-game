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


    // SAVE MAP BUTTON FUNCTIONALITY


    renderCreateMapButton() {
        this.putCreateMapButtonOnDOM()
        this.addCreateMapButtonEvent()
    }

    putCreateMapButtonOnDOM(){
        if(document.querySelector('#create-map')){
            document.querySelector('#create-map').remove()
        }
        const modalButtonContainer = this.gameMenu.gameModalButton('create-map', '<img src = "../assets/save.png" id="save">')
        document.querySelector('#map-generator-menu').insertAdjacentHTML('afterend', modalButtonContainer)
    }

    addCreateMapButtonEvent() {
        document.querySelector('#create-map').addEventListener('click', () => {
            this.setCreatedMapObj()
            this.postMap()
        })
    }

    setCreatedMapObj(){
        this.createdMap = {
            skyColor: this.skyColor,
            remainedSushi: this.remainedSushi,
            obstacles: this.obstacles,
            json_map: this.baseMap,
            playerId: this.player.Id,
            base64MapCapture : this.captureGeneratedMap()
        }
    }

    captureGeneratedMap(){
        const captureCanvas = document.querySelector('#capture-canvas')

        const context = captureCanvas.getContext('2d')
        context.drawImage(document.querySelector('#map'), 0, 0)

        const base64Data = captureCanvas.toDataURL()

        return base64Data
    }

    postMap() {
        this.db.postMap(this.createdMap).then((res) => {

            Promise.allSettled([this.db.getMapByMapId(res.map_id), this.db.getPlayerMaps(this.player.Id)])
                .then((res) => {
                    this.gameMenu = new GameMenu(res[0].value, res[1].value)

                    if(document.querySelector('.modal-body')){
                        document.querySelector('.modal-body').remove()
                    }

                    this.gameMenu.setPlayer(this.player)
                    this.gameMenu.setGameMenuContext('mapGenerator')
                    this.gameMenu.setModalBody(false)
                })

        })
    }


    // DRAW MAP FUNCTIONALITY


    drawBaseMap = () => {
        this.mapIndex = 0

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, this.mapIndex++) {
                this.tileXstart = x * this.w
                this.tileYstart = y * this.h

                this.makeBaseTile()

                if (localStorage.getItem('map')) {
                    // draw the map from local storage
                    this.drawStoredMap()
                } else {
                    // make the base for a new map
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

    drawStoredMap() {
        if (this.baseMap[this.mapIndex] !== 0) {
            this.drawSprite(this.baseMap[this.mapIndex].img)
        }
    }


    // FUNCTIONS TO DRAW ON CANVAS


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


    drawSprite = (image) => {
        const sprite = new Sprite(image, this.context)
        sprite.drawSpriteOnImageLoad(this.tileXstart, this.tileYstart)
    }


    // MODIFY BASE MAP FUNCTIONALITY
    

    addBaseTileEvent = () => {
        this.context.canvas.addEventListener('click', (event) => {
            const chosenIndex = this.getBaseMapIndex(event)

            if (document.querySelector('.selected')) {
                this.addImageOnCanvas(chosenIndex)

            } else {
                this.removeImageFromCanvas(chosenIndex)
            }

            this.updateStoredMap(chosenIndex)
        })
    }

    addImageOnCanvas(chosenIndex){
        this.baseMap[chosenIndex].gridValue = document.querySelector('.selected').getAttribute('grid-value')
        this.baseMap[chosenIndex].img = document.querySelector('.selected').getAttribute('src')

        this.isSushiChosen(chosenIndex, 'add')
        this.isObstacleChosen(chosenIndex, 'add')

        this.updateBaseMap(chosenIndex, true)
    }

    removeImageFromCanvas(chosenIndex){

        this.isSushiChosen(chosenIndex, 'remove')
        this.isObstacleChosen(chosenIndex, 'remove')

        this.baseMap[chosenIndex].gridValue = 0
        this.baseMap[chosenIndex].img = ''

        this.updateBaseMap(chosenIndex, false)
    }

    isSushiChosen(chosenIndex, action) {
        if (this.baseMap[chosenIndex].gridValue === '2') {

            if (action === 'add') {
                this.countBaseMapSushi()

                return
            }

            this.remainedSushi -= 1
        }
    }

    countBaseMapSushi(){
        let sushiCount = 0
        
        this.baseMap.forEach(tile => {

            if(tile.gridValue === '2'){
                sushiCount++
            }

        });

        this.remainedSushi = sushiCount
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

    // takes number of obstacles from previous map and sets nr of obstacles on curent map
    setObstaclesNr(obstaclesNr){
        this.obstacles = obstaclesNr
    }

    // takes number of sushi from previous map and sets nr of sushi on curent map
    setRemainedSushiNr(sushiNr){
        this.remainedSushi = sushiNr
    }

    updateBaseMap = (chosenIndex, isSelection) => {
        if (isSelection) {
            this.baseMapLoop(chosenIndex, this.drawSprite)

        } else {
            this.baseMapLoop(chosenIndex, this.makeBaseTile)
        }
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

    updateStoredMap(chosenIndex) {
        const storedMap = JSON.parse(localStorage.getItem('map'))
        storedMap[chosenIndex] = this.baseMap[chosenIndex]
        this.storeMap(storedMap)

    }

    getBaseMapIndex(event) {
        return xy2i(Math.floor(event.clientX / 50),
            Math.floor(event.clientY / 50),
            24)
    }
}