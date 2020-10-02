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

    getPlayer(name, cb){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
              console.log(this.responseText)
              cb(JSON.parse(this.responseText))
            }
          };
        
        xhttp.open("GET", `${this.baseURL}/get_player.php?Name=${name}`, true);
        xhttp.send();
      }

    postPlayer(playerObject, cb) {
        console.log(playerObject)
        const JSONplayer = JSON.stringify(playerObject)
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.response)
                cb(playerObject)
            }
        }
        xhttp.open('POST', `${this.baseURL}/post_player.php`)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSONplayer)
    }

    upadatePlayerSushi(name, sushiNumber) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
               document.querySelector('#update-info').innerHTML = this.response
               setTimeout(()=>{
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
              console.log(data)
            cb(data, mapContext)
          })
      }
      
      getMap(cb, level){
        fetch(`http://localhost/game/sushigo/maps/get_maps?${level}=1.php`)
        .then(response => response.json())
        .then(data => {
          cb(data)
        })
      }

      getMapObjects(){
          return fetch('http://localhost/game/sushigo/maps/get_mapObjects.php')
          .then(res => res.json())
      }
}