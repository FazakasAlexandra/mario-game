export class Sprite{
    constructor(imagePath, context, w, h){
        this.imagePath = imagePath
        this.context = context
        this.w = w || 50, 
        this.h = h || 50
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

    drawSpriteOnImageLoad = (x, y) => {
        let image = new Image()
        image.src = this.imagePath
        
        image.onload = () =>{
            this.image = image;
            this.drawSprite(x, y)
        }
        
    }
}