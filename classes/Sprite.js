export class Sprite{
    constructor(imagePath, context){
        this.imagePath = imagePath
        this.context = context
        this.w = 50, 
        this.h = 50
        this.image = this.getImage()
    }

    getImage(){
        let image = new Image()
        image.src = this.imagePath
        image.onload = function (e) {
            console.log(image.src);
        }
        return image
    }

    drawSprite(x,y){
        this.context.drawImage(this.image, x, y, this.w, this.h)
    }
}