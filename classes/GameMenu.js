import game from '../game.js'
import { Database } from './Database.js'
import { getModalBodyContent } from '../utilities.js'


export class GameMenu {
    constructor(newCreatedMap, prevCreatedMaps) {
        this.db = new Database()
        this.player = {}
        this.dottedMenuType = ''
        this.browseMapsContext = ''
        this.modalContext = ''
        this.newCreatedMap = newCreatedMap
        this.prevCreatedMaps = prevCreatedMaps
        this.chosenMap = []
    }

    gameModalButton(bttnId, bttnContent) {
        return `
    <div id="modal-container" class="modal-container-${bttnId}">
      <div class="row flex-spaces child-borders">
        <label id=${bttnId} class="paper-btn" for="modal-2">${bttnContent}</label>
      </div>
      <input class="modal-state" id="modal-2" type="checkbox">
      <div class="modal">
      </div>
    </div>`
    }

    setPlayer(player) {
        this.player = player
    }

    removeDottedMenu() {
        if (document.querySelector('#menu-icon')) {
            document.querySelector('#menu-icon').remove()
        }
    }

    handleMapsNotFound(){
        if(!this.browseMapsContext){
            this.modalContext = 'level-up-menu'
        }

        if(this.browseMapsContext === 'mapGenerator'){
            this.modalContext = 'mapGenerator-menu'
        }
    }

    renderDottedMenuIcon = (modalContext) => {
        this.removeDottedMenu()
        this.modalContext = modalContext
        this.dottedMenuContext = modalContext

        const menuIcon = this.gameModalButton('menu-icon', `<img src="../assets/menu.png" id="dots">`)
        document.querySelector('canvas').insertAdjacentHTML('afterend', menuIcon)

        this.menuIconEvent()
    }

    menuIconEvent() {
        document.querySelector('#menu-icon').addEventListener('click', () => {
            this.setModalBody()
        })
    }

    setGameMenuContext(modalContext){
        this.modalContext = modalContext
    }

    setModalBody = (noBrowse) => {
        document.querySelector('.modal').innerHTML = getModalBodyContent(this.modalContext, noBrowse, this.player.Name)
        this.addModalBodyButtonsEvents(noBrowse)
    }

    addModalBodyButtonsEvents(noBrowse) {
        console.log(this.modalContext)
        switch(this.modalContext){
            case 'register' :
                this.addRegisterContextEvents(noBrowse)
            break

            case 'mapGenerator' :
                this.addMapGeneratorContextEvents()
            break

            case 'mapsNotFound' :
               this.handleMapsNotFound()
            break

            case 'level-up-menu' :
                this.addLevelUpMenuEvents()
            break

            case 'mapGenerator-menu' :
                this.addMapGeneratorMenuEvents()
            break

            case 'browseMaps':
                this.displayMapsCaptures()
                this.addMapsCapturesEvents()
            break
        }
    }

    addMapGeneratorMenuEvents(){
        this.browseMapsContext = 'mapGenerator'
        
        this.browseMapsButtonEvent()
        this.levelUpButtonEvent(this.removeMapGeneratorPage)
    }

    addLevelUpMenuEvents() {
        this.createMapButtonEvent()
        this.browseMapsButtonEvent()
    }

    addMapGeneratorContextEvents = () => {
        this.browseMapsContext = 'mapGenerator'

        this.useMapButtonEvent()
        this.levelUpButtonEvent(this.removeMapGeneratorPage)
        this.browseMapsButtonEvent()
    }

    addRegisterContextEvents(noBrowse) {
        this.browseMapsContext = 'register'

        this.levelUpButtonEvent(this.removeRegisterPage)
        this.createMapButtonEvent()

        if (!noBrowse) {
            this.browseMapsButtonEvent()
        }
    }

    levelUpButtonEvent(removePage) {
        document.querySelector('#level-up-option').addEventListener('click', () => {
            removePage()
            this.removeModalContainerCreateMap()
            game.play(this.player, 'level up')
        })
    }

    isGameStop(){
        if (this.dottedMenuContext === 'level-up-menu') {
            document.querySelector('.modal-container-menu-icon').remove()
            game.stopGame()
        }
    }

    createMapButtonEvent() {
        document.querySelector('#create-map-option').addEventListener('click', () => {
            this.isGameStop()
            this.removeRegisterPage()
            game.createOwnMap(this.player)
        })
    }

    browseMapsButtonEvent() {
        document.querySelector('#browse-maps-option').addEventListener('click', () => {
            this.getMaps()
        })
    }

    useMapButtonEvent() {
        document.querySelector('#use-map-option').addEventListener('click', () => {
            this.removeModalBody()
            this.removeModalContainerCreateMap()
            this.removeMapGeneratorPage()
            game.play(this.player, 'use map', this.newCreatedMap)
        })
    }

    changeModalBody(modalContext) {
        this.modalContext = modalContext
        this.removeModalBody()
        this.setModalBody()
    }

    removeModalContainerCreateMap() {
        if (document.querySelector('.modal-container-create-map')) {
            document.querySelector('.modal-container-create-map').remove()
        }
    }

    removeModalBody() {
        if (document.querySelector('.modal-body')) {
            document.querySelector('.modal-body').remove()
        }
    }

    removeBackgroundPage() {
        if (this.browseMapsContext === 'register') {
            this.removeRegisterPage()
        }

        if (this.browseMapsContext === 'mapGenerator') {
            this.removeMapGeneratorPage()
        }
    }

    getMaps() {
        this.db.getPlayerMaps(this.player.Id).then((maps) => {
            if (maps.length > 0) {
                this.prevCreatedMaps = maps
                this.changeModalBody('browseMaps')
                return
            }

            this.changeModalBody('mapsNotFound')
        })
    }

    displayMapsCaptures() {
        this.prevCreatedMaps.forEach(map => {
            document.querySelector('#captures_container').innerHTML += `<img src=http://localhost/game/sushigo/maps/${map.map_capture} 
                                                                         style=" height=25px; width=125px;" 
                                                                         class="map-captures shadow shadow-hover"
                                                                         map-id=${map.id}>`
        });
    }

    addMapsCapturesEvents() {
        document.querySelectorAll('.map-captures').forEach(capture => {
            capture.addEventListener('click', () => {
                this.changeModalBody('choseMap')

                document.querySelector('#chosen-map-capture').src = capture.src
                const mapId = capture.getAttribute('map-id')

                this.useChosenMapEvent(mapId)
                this.editChosenMapEvent(mapId)
            })

        })
    }

    useChosenMapEvent(mapId) {
        document.querySelector('#use-map-option').addEventListener('click', () => {

            this.db.getMapByMapId(mapId).then((map) => {
                this.isGameStop()
                this.removeModalContainerCreateMap()
                this.removeBackgroundPage()

                game.play(this.player, 'use map', map)

            })

        })
    }

    editChosenMapEvent(mapId) {
        document.querySelector('#edit-map-option').addEventListener('click', () => {

            this.db.getMapByMapId(mapId).then((map) => {
                this.isGameStop()
                this.removeModalContainerCreateMap()
                this.removeBackgroundPage()

                game.editOwnMap(this.player, map.skyColor, map)

            })

        })
    }

    removeRegisterPage() {
        if (document.querySelector('#register-container')) {
            document.querySelector('#register-container').remove()
            document.body.style.backgroundColor = 'white'
            document.querySelector('#map').style.display = 'block'

        }
    }

    removeMapGeneratorPage() {
        if (document.querySelector('#map-generator-menu')) {
            document.querySelector('#map-generator-menu').remove()
        }

        if (document.querySelector('#modal-container')) {
            document.querySelector('#modal-container').remove()
        }
    }
}