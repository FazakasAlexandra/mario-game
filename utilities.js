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

// converts map coordinates to tile index coordinates
export function xy2i(x, y, mapWidth) {
    let index = y * mapWidth + x
    return index
}