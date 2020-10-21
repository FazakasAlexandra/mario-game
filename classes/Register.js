import { Database } from './Database.js'
import { GameMenu } from './GameMenu.js'

export class Register {
    constructor() {
        this.gameMenu = new GameMenu()
        this.database = new Database()
        this.newPlayer = {
            Sushi: 0,
            Level: 1
        }

        this.icons = {
            redGirl: '../assets/icons/red-girl.png',
            angryGirl: '../assets/icons/angry-girl.png',
            mario: '../assets/icons/mario.png',
            charles: '../assets/icons/charles.png'
        }

        this.spriteSheets = {
            redGirl: '../assets/characters/red-girl.png',
            angryGirl: '../assets/characters/angry-girl.png',
            mario: '../assets/characters/mario.png',
            charles: '../assets/characters/charles.png'
        }
    }

    getRegisterContainer() {
        const registerContainer = document.createElement('div')
        registerContainer.id = 'register-container'
        registerContainer.classList.add('border', 'border-primary', 'shadow')

        return registerContainer
    }

    createRegisterContainer() {
        const registerContainer = this.getRegisterContainer()
        document.body.appendChild(registerContainer)

        registerContainer.innerHTML = `<img src="../assets/logo/logo2.png" id="logo"/>
                          
                                       <div id='icons-container'>
                                       ${this.getOptions()}
                                       </div>

                                       <div id = create-container>
                                       <input id="create-player-name-input" type=text placeholder="name"/>
                                       ${this.gameMenu.gameModalButton('create', 'CREATE')}
                                       </div>

                                       <h4>already have a character?</h4>
                                       
                                       <div id = play-container>
                                         <input id="player-name-input" type=text placeholder="name"/>
                                         ${this.gameMenu.gameModalButton('play', 'PLAY')}
                                       </div>`
        this.addCreateButtonEvent()
        this.addPlayButtonEvent()
        this.addImageClickEvent()

        return registerContainer
    }

    getOptions() {
        return Object.keys(this.icons).reduce((acc, key) => {
            return `${acc}<div class="character-option">
                    <img src="${this.icons[key]}" class="shadow shadow-hover"/>
                    <input data-width="80" data-height="80" type="radio" name="character" value="${this.spriteSheets[key]}"/>
                    </div>`
        }, '')

    }

    addCreateButtonEvent() {
        document.querySelector('#create').addEventListener('click', () => {
            if(document.querySelector('#create-player-name-input').value === ""){
                this.gameMenu.setGameMenuContext('no-player-name')
                this.gameMenu.setModalBody()
                return
            }

            if(!this.setNewPlayerObject()){
                this.gameMenu.setGameMenuContext('spritesheet-not-chosen')
                this.gameMenu.setModalBody()
                return
            }

            this.postNewPlayer()
        })
    }

    setNewPlayerObject() {
        this.newPlayer.Name = document.querySelector('#create-player-name-input').value
        let isSpriteSheetChosen = false
        
        document.querySelector('#icons-container').querySelectorAll('input').forEach((input) => {
            if (input.checked) {
                isSpriteSheetChosen = true
                this.newPlayer.spriteSheet = input.value
                this.newPlayer.width = +input.getAttribute('data-width')
                this.newPlayer.height = +input.getAttribute('data-height')
            }
        })

        return isSpriteSheetChosen
    }

    postNewPlayer() {
        console.log(this.newPlayer)
        this.database.postPlayer(this.newPlayer)
            .then((player) => {
                if(player === "duplicate name"){
                    console.log('duplicate pop-up, please')
                    this.gameMenu.setPlayer({Name: this.newPlayer.Name})
                    this.gameMenu.setGameMenuContext('duplicate-name')
                    this.gameMenu.setModalBody()
                    return
                }

                this.gameMenu.setPlayer(player)
                this.gameMenu.setGameMenuContext('register')
                this.gameMenu.setModalBody(true)
            })
    }

    addPlayButtonEvent() {
        document.querySelector('#play').addEventListener('click', () => {

            if (document.querySelector('#player-name-input').value === "") {
                this.gameMenu.setGameMenuContext('no-player-name')
                this.gameMenu.setModalBody()
                return
            }

            this.getPlayer()
        })
    }

    getPlayer() {
        this.database.getPlayer(document.querySelector('#player-name-input').value)
            .then((player) => {
                console.log(player.length)
                if (player != "player not found") {
                    console.log("player exists")
                    this.addPlayerFoundModalBody(player)
                    return
                }

                this.addPlayerNotFoundModalBody()
            })
    }

    addPlayerFoundModalBody(player) {
        this.gameMenu.setPlayer(player)
        this.gameMenu.setGameMenuContext('register')
        this.gameMenu.setModalBody()
    }

    addPlayerNotFoundModalBody() {
        this.gameMenu.setPlayer({ Name: document.querySelector('#player-name-input').value })
        this.gameMenu.setGameMenuContext('player-not-found')
        this.gameMenu.setModalBody()
    }

    addImageClickEvent() {
        let images = document.querySelector('#icons-container').querySelectorAll('img')
        images.forEach(img => {
            img.addEventListener('click', (e) => {
                e.target.nextElementSibling.checked = true
            })
        })
    }

}