export function getNumbersArr(strArr, nrArr = []) {
    strArr.forEach(el => {
        el.trim()
        nrArr.push(+el)
    })
    return nrArr
}

export function i2xy(index, mapWidth) {
    let x = index % mapWidth
    let y = Math.floor(index/mapWidth)

    return [x,y]
}

// converts tile coordinates to index 
export function xy2i(x, y, mapWidth) {
    let index = y * mapWidth + x
    return index
}

function isBrowseOptionAvailable(noBrowse) {
    if (noBrowse) {
        return ''
    }
    return '<a id="browse-maps-option">BROWSE MAPS</a>'
}

export function getModalBodyContent(modalContext, noBrowse, name) {
    console.log(modalContext)
    if (modalContext === 'register') {
        return `                                         
        <div class="modal-body">
          <label class="btn-close" for="modal-2">X</label>
          <h4 class="modal-title">Welcome ${name}</h4>
          <h5 class="modal-subtitle">chose your game option : </h5>
          <a id="level-up-option">LEVEL UP</a>
          ${isBrowseOptionAvailable(noBrowse)}
          <a id="create-map-option">CREATE MAP</a>
        </div>`
    }

    if (modalContext === 'mapGenerator') {
        return `                                         
        <div class="modal-body">
          <label class="btn-close" for="modal-2">X</label>
          <h4 class="modal-title">Map successfully generated !</h4>
          <h5 class="modal-subtitle">chose your game option : </h5>
          <a id="use-map-option">USE MAP</a>
          <a id="browse-maps-option">BROWSE MAPS</a>
          <a id="level-up-option">LEVEL UP</a>
        </div>`
    }

    if (modalContext === 'mapGenerator-menu') {
        return ` 
      <div class="modal-body">
        <label class="btn-close" for="modal-2">X</label>
        <h4 class="modal-title">MENU</h4>
        <h5 class="modal-subtitle">chose your game option : </h5>
        <a id="browse-maps-option">BROWSE MAPS</a>
        <a id="level-up-option">LEVEL UP</a>
      </div>`
    }

    if(modalContext === 'level-up-menu') {
        return `
     <div class="modal-body">
        <label class="btn-close" for="modal-2">X</label>
        <h4 class="modal-title">MENU</h4>
        <h5 class="modal-subtitle">chose your game option : </h5>
        <a id="browse-maps-option">BROWSE MAPS</a>
        <a id="create-map-option">CREATE MAP</a>
      </div>`
    }

    if (modalContext === 'browseMaps') {
        return `                                         
        <div class="modal-body">
        <h4 class="modal-title">map browser</h4>   
        <h5 class="modal-subtitle">choose one of your previously created maps </h5>
          <label class="btn-close" for="modal-2">X</label>
          <div id="captures_container">
          </div>
        </div>`
    }

    if (modalContext === 'browseMaps-MapsNotFound') {
        return`
     <div class="modal-body">
        <label class="btn-close" for="modal-2">X</label>
        <h4 class="modal-title">maps not found</h4>
        <h5 class="modal-subtitle">you have no created maps. Chose one of the above options : </h5>
        <a id="level-up-option">LEVEL UP</a>
        <a id="create-map-option">CREATE MAP</a>
      </div>`
    }

    if (modalContext === 'choseMap') {
        return `                                         
        <div class="modal-body">
          <label class="btn-close" for="modal-2">X</label>
          <img id="chosen-map-capture">
          <div id="chosen-map-options-container">
          <a id="use-map-option">USE MAP</a>
          <a id="edit-map-option">EDIT MAP</a>
          </div>
        </div>`
    }

    if(modalContext === 'player-not-found'){
      return`
      <div class="modal-body">
         <label class="btn-close" for="modal-2">X</label>
         <h4 class="modal-title">player not found</h4>
         <h5 class="modal-subtitle">${name} is not a player, please try again or create a character</h5>
       </div>`
    }

    if(modalContext === "no-player-name"){
      return`
      <div class="modal-body">
         <label class="btn-close" for="modal-2">X</label>
         <h4 class="modal-title">name needed</h4>
         <h5 class="modal-subtitle">please enter your characters name !</h5>
       </div>`
    }

    if(modalContext === "duplicate-name"){
      return`
      <div class="modal-body">
         <label class="btn-close" for="modal-2">X</label>
         <h4 class="modal-title">name not valid</h4>
         <h5 class="modal-subtitle">Character name "${name}" is already taken, please chose a different one.</h5>
       </div>`
    }

    if(modalContext === "spritesheet-not-chosen"){
      return`
      <div class="modal-body">
         <label class="btn-close" for="modal-2">X</label>
         <h4 class="modal-title">character skin needed</h4>
         <h5 class="modal-subtitle">Please chose one of the available character skins.</h5>
       </div>`
    }
}