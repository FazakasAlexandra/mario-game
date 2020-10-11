import { Register } from './classes/Register.js'
import game from './game.js'

//blocks default horizontal scrolling by left/right arrow keys
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 39].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

window.addEventListener('load', () => {
    localStorage.removeItem('map')

    //document.getElementById('map').style.display = 'block'
    //game.createOwnMap({Id: 62, Name: 'ale', Level: 3, Sushi: 0, spriteSheet: './assets/characters/red-girl.png', width:80, height:80})
})

let register = new Register()
register.createRegisterContainer()

//document.getElementById('map').style.display = 'block'
//game.play({Name: 'ale', Level: 3, Sushi: 0, spriteSheet: './assets/characters/red-girl.png', width:80, height:80}, 'level up')

