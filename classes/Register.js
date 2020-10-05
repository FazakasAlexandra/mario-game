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
            redGirl : '../assets/icons/red-girl.png',
            angryGirl : '../assets/icons/angry-girl.png',
            mario : '../assets/icons/mario.png',
            charles : '../assets/icons/charles.png'
        }

        this.spriteSheets = {
            redGirl : '../assets/characters/red-girl.png',
            angryGirl : '../assets/characters/angry-girl.png',
            mario : '../assets/characters/mario.png',
            charles : '../assets/characters/charles.png'
        }
    }

    createRegisterContainer() {
        const registerContainer = document.createElement('div')
        registerContainer.id = 'register-container'

        registerContainer.classList.add('border','border-primary','shadow')
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

    getOptions(){
        return Object.keys(this.icons).reduce((acc, key) => {
            return `${acc}<div class="character-option">
                    <img src="${this.icons[key]}" class="shadow shadow-hover"/>
                    <input data-width="80" data-height="80" type="radio" name="character" value="${this.spriteSheets[key]}"/>
                    </div>`
        }, '')
        
    }


    addCreateButtonEvent() {
        document.querySelector('#create').addEventListener('click', () => {
            this.newPlayer.Name = document.querySelector('#create-player-name-input').value
            
            let inputs = document.querySelector('#icons-container').querySelectorAll('input')
            inputs.forEach((input)=>{
                if(input.checked){
                    this.newPlayer.spriteSheet = input.value
                    this.newPlayer.width = +input.getAttribute('data-width')
                    this.newPlayer.height = +input.getAttribute('data-height')
                }
            })

            this.database.postPlayer(this.newPlayer)
            .then((message)=>{
                this.newPlayer.Id = message.player_id
                this.gameMenu.setModalBody(this.newPlayer, 'register')
            })
        })
    }

    addPlayButtonEvent() {
        document.querySelector('#play').addEventListener('click', () => {
            const name = document.querySelector('#player-name-input').value
            this.database.getPlayer(name, 'register', this.gameMenu.setModalBody)
        })
    }

    addImageClickEvent(){
        let images = document.querySelector('#icons-container').querySelectorAll('img')
        images.forEach(img => {
            img.addEventListener('click', (e)=>{
                e.target.nextElementSibling.checked = true
            })
        })
    }

}