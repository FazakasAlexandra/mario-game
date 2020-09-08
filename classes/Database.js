export class Database {
    constructor() {
        this.baseURL = 'http://localhost/players/db'
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

        xhttp.open("GET", `${this.baseURL}/get-players.php`, true);
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
        
        xhttp.open("GET", `${this.baseURL}/get-player.php?Name=${name}`, true);
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
        xhttp.open('POST', `${this.baseURL}/post-player.php`)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSONplayer)
    }

    upadatePlayerSushi(name, sushiNumber) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.response)
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
}