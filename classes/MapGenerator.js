import { Sprite } from './Sprite.js'
import { Database } from './Database.js'
import { xy2i } from '../utilities.js'

export class MapGenerator {
    constructor(context) {
        this.context = context
        this.mapIndex = 0
        this.w = 50
        this.h = 50
        this.tileXstart = 0
        this.tileYstart = 0
        this.baseMap = []

    }

    renderCreateMapButton(){
        const button = document.createElement('button')
        button.innerText = 'CREATE MAP'
        button.classList.add('btn-secondary-outline')
        button.id = "create-map-button"
        document.body.appendChild(button)
    }

    drawBaseMap = () => {
        console.log('here')
        this.mapIndex = 0

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, this.mapIndex++) {
                this.tileXstart = x * this.w
                this.tileYstart = y * this.h

                this.baseMap.push({gridValue : 0, img : ''})

                this.makeBaseTile()
            }
        }
        this.addMapTileBaseEvent()
        console.log(this.baseMap)
    }

    makeBaseTile = () => {
        this.setBaseTileFill()
        this.setBaseTileBorder()
    }

    setBaseTileFill() {
        this.context.fillStyle = "#7FBFFF";
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
        if(isSelection){
            this.baseMapLoop(chosenIndex, this.drawSprite)
            
        } else {
            this.baseMapLoop(chosenIndex, this.makeBaseTile)
        }
    }

    drawSprite = (image) => {
        console.log(this, this.context)
        const sprite = new Sprite(image, this.context)
        sprite.drawSpriteOnImageLoad(this.tileXstart, this.tileYstart)
    }


    baseMapLoop = (chosenIndex, updateAcction) => {
        this.mapIndex = 0
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 24; x++, this.mapIndex++) {
                this.tileXstart = x * this.w
                this.tileYstart = y * this.h

                if(this.mapIndex === chosenIndex){
                    updateAcction(this.baseMap[chosenIndex].img)
                }
            }
        }
        console.log(this.baseMap)
    }

    addMapTileBaseEvent = () => {
        this.context.canvas.addEventListener('click', (event) => {
            const chosenIndex = this.getBaseMapIndex(event)

                if(document.querySelector('.selected')){
                    this.baseMap[chosenIndex].gridValue = document.querySelector('.selected').getAttribute('grid-value')
                    this.baseMap[chosenIndex].img = document.querySelector('.selected').getAttribute('src')
                    this.updateBaseMap(chosenIndex, true)

                } else {
                    this.baseMap[chosenIndex].gridValue = 0
                    this.baseMap[chosenIndex].img = ''
                    this.updateBaseMap(chosenIndex, false)
                }
        })
    }

    getBaseMapIndex(event){
        return xy2i(Math.floor(event.clientX / 50),
                    Math.floor(event.clientY / 50),
                    24)
    }
}