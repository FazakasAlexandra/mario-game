import game from '../game.js'
import { defaultHTML } from '../utilities.js'

export class GameMenu {
    constructor(createdMap, allPlayersMap) {
        this.player
        this.createdMap = createdMap,
            this.allPlayersMap = allPlayersMap
    }

    gameModalButton(bttnId, bttnContent) {
        return `
    <div id="modal-container">
      <div class="row flex-spaces child-borders">
        <label id=${bttnId} class="paper-btn margin" for="modal-2">${bttnContent}</label>
      </div>
      <input class="modal-state" id="modal-2" type="checkbox">
      <div class="modal">
      </div>
    </div>`
    }

    setModalBody = (player, modalContext) => {
        this.player = player

        document.querySelector('.modal').innerHTML += this.getModalBodyContent(modalContext)
        this.addModalBodyButtonsEvents(modalContext)
    }

    addModalBodyButtonsEvents(modalContext) {
        if (modalContext === 'register') {
            this.addRegisterContextEvents()
        }
        if (modalContext === 'mapGenerator') {
            this.addMapGeneratorContextEvents()
        }
    }

    getModalBodyContent(modalContext) {
        if (modalContext === 'register') {
            return `                                         
            <div class="modal-body">
              <label class="btn-close" for="modal-2">X</label>
              <h4 class="modal-title">Welcome back, ${this.player.Name}</h4>
              <h5 class="modal-subtitle">chose your game option : </h5>
              <a id="level-up-option">LEVEL UP</a>
              <a id="choose-map-option">CHOOSE MAP</a>
              <a id="build-map-option">CREATE MAP</a>
            </div>`
        }

        if (modalContext === 'mapGenerator') {
            return `                                         
            <div class="modal-body">
              <label class="btn-close" for="modal-2">X</label>
              <h4 class="modal-title">Map successfully generated !</h4>
              <h5 class="modal-subtitle">chose your game option : </h5>
              <a id="use-map-option">USE MAP</a>
              <a id="choose-map-option">CHOOSE ANOTHER MAP</a>
              <a id="level-up-option">LEVEL UP</a>
            </div>`
        }
    }

    addMapGeneratorContextEvents() {
        document.querySelector('#use-map-option').addEventListener('click', () => {
            console.log('time to use new map')
            this.removeMapGeneratorPage()
            game.play(this.player, 'use map', this.createdMap)
        })

        document.querySelector('#level-up-option').addEventListener('click', () => {
            this.removeMapGeneratorPage()
            game.play(this.player, 'level up')
        })

        document.querySelector('#choose-map-option').addEventListener('click', () => {
            console.log('display player maps')
        })
    }


    addRegisterContextEvents() {
        document.querySelector('#level-up-option').addEventListener('click', () => {
            document.body.backgroundColor = 'none'
            this.removeRegisterPage()
            game.play(this.player, 'level up')
        })

        document.querySelector('#choose-map-option').addEventListener('click', () => {
            console.log('display player maps')
        })

        document.querySelector('#build-map-option').addEventListener('click', () => {
            document.body.backgroundColor = 'none'
            this.removeRegisterPage()
            game.createOwnMap(this.player)
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
        document.querySelector('#map-generator-menu').remove()
        document.querySelector('#modal-container').remove()
    }
}