import { Mario } from './classes/Mario.js'
import { Map } from './classes/Map.js'

let canvas, context, mario, map

export default function play(player) {
    canvas = document.getElementById('map')
    context = canvas.getContext('2d')

    start()
    function start() {
        console.log('first loaded')

        const spriteSheet = new Image()
        spriteSheet.src = player.spriteSheet
        map = new Map(context)
        console.log(map)
        mario = new Mario(canvas,
            context,
            map.firstMap,
            spriteSheet,
            // x coordinate 
            0,
            // y coordinate
            canvas.height / 2,
            // sprite sheet width and height
            spriteSheet.width,
            spriteSheet.height,
            // frames per secound
            500,
            // number of frames
            4,
            // sprite width
            player.width,
            // sprite height
            player.height,
            // level
            player)

        document.getElementById('sushiNumbers').innerText = mario.sushi
        document.querySelector('#game-info').style.display = 'flex'

        loop()
    }

    renderMap()

    function renderMap() {
        setInterval(() => {
             map.mapModels.forEach((model, i) => {
                if (model.level === mario.level) {
                    console.log(model)
                    map.currentMap = map.mapModels[i]
                    mario.currentMap = map.currentMap
                    map.drawMap(map.currentMap)
                }
            }) 

        }, 1000)
    }

    function loop() {
        update()
        //context.clearRect(0, 0, canvas.width, canvas.height)
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
    window.addEventListener('keyup', (e) => {
        e.preventDefault()
        mario.isTouchingFlag()

        if (mario.level === 2 || mario.level === 3) {
            mario.isTouchingSushi()
        }

        if (mario.level === 3) {
            mario.isTouchingBox()
        }

        switch (e.keyCode) {
            case 39:
                mario.makeSteps('right', map, map.drawMap)
                break

            case 37:
                mario.makeSteps('left', map, map.drawMap)
                break

            case 32:
                mario.jump(map, map.drawMap)
                break
        }

    })

     //blocks default horizontal scrolling by left/right arrow keys
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false); 
}