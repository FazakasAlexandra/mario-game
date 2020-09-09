import { Database } from './Database.js'
import play from '../game.js'

export class Register {
    constructor() {
        this.database = new Database()
        this.newPlayer = {
            Sushi: 0,
            Level: 1
        }

        this.icons = {
            redGirl : '../assets/icons/red-girl.png',
            alexandra : '../assets/icons/alexandra.png',
            mario : '../assets/icons/mario.png',
            charles : '../assets/icons/charles.png'
        }

        this.spriteSheets = {
            redGirl : '../assets/characters/red-girl.png',
            alexandra : '../assets/characters/alexandra.png',
            mario : '../assets/characters/mario.png',
            charles : '../assets/characters/charles.png'
        }
    }

    getIcon(){

    }

    startGame(player) {
        document.querySelector('#register-container').remove()
        document.querySelector('#map').style.display = 'block'

        play(player)
    }

    createRegisterContainer() {
        const registerContainer = document.createElement('div')
        registerContainer.id = 'register-container'

        registerContainer.classList.add('border','border-primary','shadow')
        document.body.appendChild(registerContainer)
        registerContainer.innerHTML = `<h3>create character</h3>

                                       <div id='icons-container'>
                                       ${this.getOptions()}
                                       </div>

                                       <div id = create-container>
                                       <input type=text placeholder="name"/>
                                       <button id='create'>Create</button>
                                       </div>

                                       <h4>already have a character?</h4>
                                       
                                       <div id = play-container>
                                       <input type=text placeholder="name"/>
                                       <button id='play'>PLAY</button>
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
                    <input data-width="80" data-height="80" type="radio" name="character" value=${this.spriteSheets[key]}/>
                    </div>`
        }, '')
        
    }


    addCreateButtonEvent() {
        document.querySelector('#create').addEventListener('click', (e) => {
            this.newPlayer.Name = e.target.previousElementSibling.value
            
            let inputs = document.querySelector('#icons-container').querySelectorAll('input')
            inputs.forEach((input)=>{
                if(input.checked){
                    this.newPlayer.spriteSheet = input.value
                    this.newPlayer.width = +input.getAttribute('data-width')
                    this.newPlayer.height = +input.getAttribute('data-height')
                }
            })

            this.database.postPlayer(this.newPlayer, this.startGame)
        })
    }

    addPlayButtonEvent() {
        document.querySelector('#play').addEventListener('click', (e) => {
            const name = e.target.previousElementSibling.value
            this.database.getPlayer(name, this.startGame)
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