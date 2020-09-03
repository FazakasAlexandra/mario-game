export class Animation {
    constructor(spritesheet, x, y, width, height, timePerFrame) {
        this.spritesheet = spritesheet
        //the x coordinate of the object
        this.x = x

        //the y coordinate of the object
        this.y = y

        // width of the spritesheet
        this.width = width

        //heigth of the spritesheet
        this.height = height

        //time in(ms) given to each frame
        this.timePerFrame = timePerFrame

        //current frame index pointer
        this.frameIndex = 0;

        //time the frame index was last updated
        this.lastUpdate = Date.now();

    }

    update() {
        if(Date.now() - this.lastUpdate >= this.timePerFrame){
            this.frameIndex++
            if(this.frameIndex >= this.numberOfFrames){
                this.frameIndex = 0
            }
            this.lastUpdate = Date.now()
        }
    }

    draw(context){
        context.drawImage(this.spritesheet,
                          this.frameIndex * this.width / this.numberOfFrames,
                          0,
                          this.width / this.numberOfFrames,
                          this.height,
                          this.x,
                          this.y,
                          50,
                          50)
    }

    i2xy(index, mapWidth) {
        let x = index % mapWidth
        let y = Math.floor(index/mapWidth)
    
        return [x,y]
    }

    drawAnimated(context,frames) {
        //frameSets = [[1,2,3], 
        //             [4,5,6], 
        //             [7,8,9]]
        //frames = frameSets[frameSetsIndex] -> [1,2,3]
        //frame = frames[framesIndex]
            this.currentFrame = frames[this.frameIndex]

            const res = this.i2xy(this.currentFrame, this.numberOfFrames)
            
            const clipedWidth = this.spritesheet.width / this.numberOfFrames
            const clipedHeight = this.spritesheet.height / this.numberOfFrames;

            context.drawImage(this.spritesheet, 
                              res[0] * clipedWidth, 
                              res[1] * clipedHeight, 
                              clipedWidth, 
                              clipedHeight, 
                              this.x,
                              this.y,
                              this.w, 
                              this.h)
        }
    // 7 params
    // drawImage(spritesheet, 
    //           x coordonate to start clipping, 
    //           y coordonate to start clipping, 
    //           clipped img width, 
    //           clipped img height, 
    //           x coordonate to place img on canvas, 
    //           y coordonate to place img on canvas.)
}