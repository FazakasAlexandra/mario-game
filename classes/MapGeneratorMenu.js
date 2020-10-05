import { Database } from './Database.js'
import { MapGenerator } from './MapGenerator.js'

export class MapGeneratorMenu {
    constructor(context, player) {
        this.context = context
        this.player = player
        this.db = new Database()
        this.menu;
        this.skyColors = [
            '#226289',
            '#7FBFFF',
            '#9fd8fb'
        ]
        this.gameObjects = [
            { fileName : 'grass2.png', gridValue : 1 },
            { fileName : 'grass3.png', gridValue : 1 },
            { fileName : 'grass4.jpg', gridValue : 1 },
            { fileName : 'grass5.png', gridValue : 1 },
            { fileName : 'sushi.png', gridValue : 2 },
            { fileName : 'sushi_2.png', gridValue : 2 },
            { fileName : 'flag.png', gridValue : 3 },
            { fileName : 'flag_2.png', gridValue : 3 },
            { fileName : 'box.png', gridValue : 4 },
            { fileName : 'box_2.png', gridValue : 4 },
            { fileName : 'brick.png', gridValue : 4 },
            { fileName : 'cloud.png', gridValue : 1 },
        ]
    }

    setMenu() {
        this.menu = document.createElement('div')
        this.menu.id = 'map-generator-menu'
        this.menu.innerHTML = `${this.getObjectsImage()}
                               <div id="color-options-container">
                                 ${this.getSkyColorOptions()}
                               </div>`

        document.body.appendChild(this.menu)
        this.addMenuObjectsEvents()
        this.addSkyColorOptionsEvent()
    }

    getSkyColorOptions(){
       return this.skyColors.reduce((acc,color,idx)=>{
           return `${acc}<div class="color-options" color=${color} id="color-option-${idx}"></div>`
       }, '')
    }

    getObjectsImage() {
        return this.gameObjects.reduce((acc, obj) => {
            return `${acc}<img src="../assets/objects/${obj.fileName}" class="map-menu-items" grid-value=${obj.gridValue}>`
        }, '');
    }

    addMenuObjectsEvents() {
        console.log(this.menu)
        this.menu.querySelectorAll('.map-menu-items').forEach(item => {

            item.addEventListener('click', (e) => {
                this.addSelectedClass(e)
            })
        })
    }

    addSelectedClass(e) {
        if (e.target.classList.contains('selected')) {
            document.querySelector('.selected').classList.remove('selected')
            return
        }

        if (document.querySelector('.selected')) {
            document.querySelector('.selected').classList.remove('selected')
        }

        e.target.classList.add('selected')
    }

    addSkyColorOptionsEvent(){
        this.menu.querySelectorAll('.color-options').forEach(color => {
            color.addEventListener('click',(e)=>{
                console.log(this.context, this.player)
                const mapGenerator = new MapGenerator(
                                         this.context, 
                                         this.player, 
                                         e.target.getAttribute('color'),
                                         JSON.parse(localStorage.getItem('map')))
                mapGenerator.drawBaseMap()
            })
        })
    }

}