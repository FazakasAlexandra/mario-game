import { Player } from './classes/Player.js'
import { Map } from './classes/Map.js'
import { MapGenerator } from './classes/MapGenerator.js'
import { MapGeneratorMenu } from './classes/MapGeneratorMenu.js'

const game = {
    canvas : document.getElementById('map'), 
    context : document.getElementById('map').getContext('2d')
}

game.play = function (player, gameType, playersMap) {
    game.map = new Map(game.context)

    start()

    function start() {
        const spriteSheet = new Image()
        spriteSheet.src = player.spriteSheet

        player = new Player(game.canvas,
            game.context,
            spriteSheet,
            // x coordinate 
            0,
            // y coordinate
            game.canvas.height / 2,
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

        document.getElementById('sushiNumbers').innerText = player.sushi
        document.querySelector('#game-info').style.display = 'flex'

        loop()
    }

    renderMap(gameType)

    function renderMap() {
        setInterval(() => {
            if (gameType === 'level up') {
                game.map.mapModels.forEach((model) => {
                    if (model.level === player.level) {
                        game.map.currentMap = model
                        player.currentMap = model
                        game.map.drawMap(model)
                    }
                })
            }


            if(gameType === 'use map'){
                game.map.currentMap = playersMap
                player.currentMap = playersMap
                game.map.drawMap(playersMap)
            }

        }, 1000)
    }

    function loop() {
        update()
        draw()
        requestAnimationFrame(loop)
    }

    function draw() {
        player.drawAnimated(player.context, player.currentFrameSet)
    }

    function update() {
        player.update()
    }

    //player movement
    window.addEventListener('keyup', (e) => {
        e.preventDefault()
        player.isTouchingFlag()

        if (game.map.currentMap.remainedSushi > 0) {
            player.isTouchingSushi()
        }

        if (game.map.currentMap.obstacles > 0) {
            player.isTouchingBox()
        }

        switch (e.keyCode) {
            case 39:
                player.makeSteps('right', game.map, game.map.drawMap)
                break

            case 37:
                player.makeSteps('left', game.map, game.map.drawMap)
                break

            case 32:
                player.jump(game.map, game.map.drawMap)
                break
        }

    })

    //blocks default horizontal scrolling by left/right arrow keys
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 39].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
}

game.createOwnMap = function (player) {
    const mapGenerator = new MapGenerator(game.context, player)
    mapGenerator.drawBaseMap()

    const mapGeneratorMenu = new MapGeneratorMenu(mapGenerator)
    mapGeneratorMenu.setMenu()

    mapGenerator.renderCreateMapButton()
}

export default game
