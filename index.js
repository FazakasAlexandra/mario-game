import {Register} from './classes/Register.js'
import game from './game.js'

window.addEventListener('load', ()=>{
    console.log('loaded')
    localStorage.removeItem('map')

    //document.getElementById('map').style.display = 'block'
    //game.createOwnMap({Id: 62, Name: 'ale', Level: 3, Sushi: 0, spriteSheet: './assets/characters/red-girl.png', width:80, height:80})
}) 

let register = new Register()
register.createRegisterContainer()

//document.getElementById('map').style.display = 'block'
//game.play({Name: 'ale', Level: 3, Sushi: 0, spriteSheet: './assets/characters/red-girl.png', width:80, height:80}, 'level up')

