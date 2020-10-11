import { Player } from './classes/Player.js'
import { Map } from './classes/Map.js'
import { GameMenu } from './classes/GameMenu.js'
import { MapGenerator } from './classes/MapGenerator.js'
import { MapGeneratorMenu } from './classes/MapGeneratorMenu.js'

const game = {
    canvas: document.getElementById('map'),
    context: document.getElementById('map').getContext('2d')
}

game.stopGame = function () {
    game.sushiInfo('', 'none')
    clearInterval(game.intervalId);
    cancelAnimationFrame(game.animationFrameId)
    window.removeEventListener('keyup', game.movePlayer)
}

game.sushiInfo = function (text, displayStyle) {
    document.getElementById('sushiNumbers').innerText = text
    document.querySelector('#game-info').style.display = displayStyle
}

game.play = function (player, gameType, playersMap) {
    game.setLevelUpDottedMenu(player)

    game.map = new Map(game.context)

    start()

    function start() {
        const spriteSheet = new Image()
        spriteSheet.src = player.spriteSheet

        game.player = new Player(game.canvas,
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

        game.sushiInfo(game.player.sushi, 'flex')

        loop()
    }

    renderMap(gameType)

    function renderMap() {
        game.intervalId = setInterval(() => {
            if (gameType === 'level up') {
                game.map.mapModels.forEach((model) => {
                    if (model.level === game.player.level) {
                        game.map.currentMap = model
                        game.player.currentMap = model
                        game.map.drawMap(model)
                    }
                })
            }


            if (gameType === 'use map') {
                game.map.currentMap = playersMap
                game.player.currentMap = playersMap
                game.map.drawMap(playersMap)
            }

        }, 1000)
    }

    function loop() {
        update()
        draw()
        game.animationFrameId = requestAnimationFrame(loop)
    }

    function draw() {
        game.player.drawAnimated(game.player.context, game.player.currentFrameSet)
    }

    function update() {
        game.player.update()
    }

    //player movement
    window.addEventListener('keyup', game.movePlayer)
}

game.movePlayer = function (e) {
    e.preventDefault()
    game.player.isTouchingFlag()

    if (game.map.currentMap.remainedSushi > 0) {
        console.log(game.map.currentMap)
        game.player.isTouchingSushi()
    }

    if (game.map.currentMap.obstacles > 0) {
        game.player.isTouchingBox()
    }

    switch (e.keyCode) {
        case 39:
            game.player.makeSteps('right', game.map, game.map.drawMap)
            break

        case 37:
            game.player.makeSteps('left', game.map, game.map.drawMap)
            break

        case 32:
            game.player.jump(game.map, game.map.drawMap)
            break
    }
}

game.removeStoredMap = function () {
    localStorage.removeItem('map')
}

game.createOwnMap = function (player) {
    const mapGenerator = new MapGenerator(game.context, player)
    game.removeStoredMap()
    mapGenerator.drawBaseMap()

    game.setGameGeneratorMenu(mapGenerator)
    game.setGameGeneratorDottedMenu(player)


    mapGenerator.renderCreateMapButton()
}

game.editOwnMap = function (player, skyColor, map) {
    const mapGenerator = new MapGenerator(game.context, player, skyColor, map.json_map)
    mapGenerator.storeMap(map.json_map)
    mapGenerator.setObstaclesNr(map.obstacles)
    mapGenerator.setRemainedSushiNr(map.remainedSushi)
    mapGenerator.drawBaseMap()

    game.setGameGeneratorMenu(mapGenerator)
    game.setGameGeneratorDottedMenu(player)

    mapGenerator.renderCreateMapButton()
}

game.setGameGeneratorDottedMenu = function (player) {
    const gameMenu = new GameMenu()
    gameMenu.setPlayer(player)
    gameMenu.renderDottedMenuIcon('mapGenerator-menu')
}

game.setGameGeneratorMenu = function (mapGenerator) {
    const mapGeneratorMenu = new MapGeneratorMenu(mapGenerator)
    mapGeneratorMenu.setMenu()
}

game.setLevelUpDottedMenu = function (player) {
    const gameMenu = new GameMenu(player)
    gameMenu.setPlayer(player)
    gameMenu.renderDottedMenuIcon('level-up-menu')
}

export default game
