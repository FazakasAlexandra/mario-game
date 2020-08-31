import { Mario } from './classes/Mario.js'
import { Map } from './classes/Map.js'

let canvas, context, mario, marioSpritesheet, map


canvas = document.getElementById('canvas')
context = canvas.getContext('2d')
let mapCanvas = document.getElementById('map')
let mapContext = mapCanvas.getContext('2d')

window.onload = () => {

    console.log('first loaded')
    marioSpritesheet = new Image()
    marioSpritesheet.src = './assets/characters/mario.png'
    map = new Map(mapContext)

    mario = new Mario(canvas,
        mapContext,
        marioSpritesheet,
    // x coordinate 
        canvas.width / 2 - 40,
    // y coordinate
        canvas.height / 2 + 10,
    // sprite sheet width and height
        marioSpritesheet.width,
        marioSpritesheet.height,
    // frames per secound
        500,
    // number of frames
        4,
    // sprite width
        80,
    // sprite height
        80)

    loop()
}

setInterval(()=>{
    if(mario.level === 0){
        map.drawMap()
        map.mapFunction = map.drawMap
    }
    if(mario.level === 1){
        map.drawSecoundMap()
        map.mapFunction = map.drawSecoundMap
    }
},1000)

function loop() {
    console.log('loaded')
    update()
    context.clearRect(0, 0, canvas.width, canvas.height)
    draw()
    requestAnimationFrame(loop)
}

function draw() {
    mario.drawAnimated(mario.context, mario.currentFrameSet)
}

function update() {
    mario.update()
}

//mario movement
//39r, 37l 
window.addEventListener('keyup', (e) => {
    mario.isOutsideCanvas()
    switch(e.keyCode){
        case 39:
            console.log(map.mapFunction)
            mario.makeSteps('right', map, map.mapFunction)
        break

        case 37:
            console.log(map.mapFunction)
            mario.makeSteps('left', map, map.mapFunction)
        break
    }
})