export class Database {
    constructor() {
        this.baseURL = 'http://localhost/game/sushigo/players'
        this.infoUpdateContainer = document.querySelector('#update-info')
    }

    getPlayers() {
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let parsed = JSON.parse(this.response)
                console.log(parsed)
                console.log(parsed[0].Name)
            }
        };

        xhttp.open("GET", `${this.baseURL}/get_players.php`, true);
        xhttp.send();
    }

    getPlayer(name) {
        return fetch(`${this.baseURL}/get_player.php?Name=${name}`)
        .then((res)=>res.json())
    }

    postPlayer(playerObject) {
        return fetch(`${this.baseURL}/post_player.php`, {
            method: 'POST',
            body: JSON.stringify(playerObject),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((response)=>{
                if(response === "duplicate name"){
                    return "duplicate name"
                }
                playerObject.Id = response.player_id
                return playerObject
            })

    }

    upadatePlayerSushi(name, sushiNumber) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.querySelector('#update-info').innerHTML = this.response
                setTimeout(() => {
                    document.querySelector('#update-info').innerHTML = ''
                }, 1000)
            }
        }

        xhttp.open("PUT", `${this.baseURL}/update_player_sushi.php?Name=${name}&Sushi=${sushiNumber}`)
        xhttp.send();
    }

    upadatePlayerLevel(name, level) {
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.response)
            }
        }

        xhttp.open("PUT", `${this.baseURL}/update_player_level.php?Name=${name}&Level=${level}`)
        xhttp.send();
    }

    getMaps(cb, mapContext) {
        fetch('http://localhost/game/sushigo/maps/get_maps.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(el => {
                    el.json_map = JSON.parse(el.json_map)
                });
                cb(data, mapContext)
            })
    }

    getMap(cb, level) {
        fetch(`http://localhost/game/sushigo/maps/get_maps?level=${level}.php`)
            .then(response => response.json())
            .then(data => {
                cb(data)
            })
    }

    postMap(map) {
        return fetch(`http://localhost/game/sushigo/maps/post_map`, {
            method: 'POST',
            body: JSON.stringify(map),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
    }

    getPlayerMaps(playerId) {
        return fetch(`http://localhost/game/sushigo/maps/get_maps.php?player_id=${playerId}`)
            .then(res => res.json())
            .then((maps) => {
                
                maps.forEach(el => {
                    el.json_map = JSON.parse(el.json_map)
                })

                return maps
            })
    }

    getMapByMapId(mapId) {
        return fetch(`http://localhost/game/sushigo/maps/get_maps.php?map_id=${mapId}`)
            .then(res => res.json())
            .then(map => {
                map.json_map = JSON.parse(map.json_map)

                const coordinates = {
                    boxCoordinates: [],
                    sushiCoordinates: [],
                    flagCoordinates: {
                        x: null,
                        y: null
                    }
                }

                return { ...map, ...coordinates }
            })
    }

}