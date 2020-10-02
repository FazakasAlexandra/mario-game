import { Database } from './Database.js'

export class MapGeneratorMenu {
    constructor() {
        this.db = new Database()
        this.menu;
        this.gameObjects = [
            { fileName : 'grass.png', gridValue : 1 },
            { fileName : 'grass2.png', gridValue : 1 },
            { fileName : 'grass3.png', gridValue : 1 },
            { fileName : 'grass4.jpg', gridValue : 1 },
            { fileName : 'grass5.png', gridValue : 1 },
            { fileName : 'sushi.png', gridValue : 2 },
            { fileName : 'flag.png', gridValue : 3 },
            { fileName : 'box.png', gridValue : 4 },
            { fileName : 'brick.png', gridValue :  5 },
            { fileName : 'cloud.png', gridValue : 6 },
            { fileName : 'meat.png', gridValue : 7 },
            { fileName : 'moon.png', gridValue : 8 },
        ]
    }

    setMenu() {
        this.menu = document.createElement('div')
        this.menu.id = 'map-generator-menu'
        this.menu.innerHTML = this.getObjectsImage()

        document.body.appendChild(this.menu)
        this.addMenuObjectsEvents()
    }

    getObjectsImage() {
        return this.gameObjects.reduce((acc, obj) => {
            return `${acc}<img src="../assets/objects/${obj.fileName}" class="map-menu-items" grid-value=${obj.gridValue} file-name=${obj.fileName}>`
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

}