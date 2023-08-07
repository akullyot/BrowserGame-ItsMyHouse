
class Canvas
{
    constructor(canvasID, width, height)
    {
        this.width    = width;
        this.height   = height;
        this.canvasID = canvasID;
        this.canvasElement = null; //used once you instantiate the canvas
        this.ctx           = null; //used once you instantiate the canvas 
    }
    getCanvasMade()
    {
        this.canvasElement = document.getElementById(this.canvasID);
        this.ctx = this.canvasElement.getContext('2d');
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
    }
}
class ImageClass 
{
    constructor (src, xCoord, yCoord, height, width, canvasID )
    {
        this.src           = src;
        this.yCoord        = yCoord;
        this.xCoord        = xCoord;
        this.canvasID      = canvasID;
        this.height        = height;
        this.width         = width;
        this.imageElement  = null;
    }
    // Purpose: creates a new image element and appliesit to the canvas
    createImageElement()
    {
        let image = new Image();
        image.src = this.src;
        // TODO later you will want to promise all for every image you create before running the animation 
        this.imageElement = image;
    }
    drawImage()
    {
        if (this.imageElement === null)
        {
            console.warn('you are trying to work with an image element you have not created. run classInstanceName.createImageElement() and/or check your promise All.')
        }
        else
        {
            document.getElementById(this.canvasID).getContext('2d').drawImage(this.imageElement);
        }
    }
}
class MoveableImage extends ImageClass
{
    constructor (src, xCoord, yCoord,srcX,srcY,height,width,canvasID,speed,)
    {
        super (src, xCoord, yCoord,height,width,canvasID);
        this.speed          = speed;
        this.animateBoolean = false;
        this.weaponBoolean  = false;
        this.srcX           = srcX;
        this.srcY           = srcY;
        this.framesDrawn    = 0;
        this.totalFrames    = 7;
        this.currentFrame   = 0;    
        this.previousXCoord = null;
        this.previousYCoord = null;
    }
    animate()
    {
        if (this.animateBoolean)
        {
            //Keep track of the number of animation frames to choose the correct sprite
            this.currentFrame = this.currentFrame % this.totalFrames; 
            this.srcX = this.currentFrame * this.width; //Src position is updated to show the new sprite image
        }
        else
        {
            this.srcY = 10 * this.height;
            this.currentFrame = 0;
        }
    
            //image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight
            playerAreaCanvas.ctx.drawImage(this.imageElement, this.srcX, this.srcY, this.width, this.height, this.xCoord, this.yCoord, this.width, this.height);
            this.framesDrawn++;
            if(this.framesDrawn >= 10)
            {
                this.currentFrame++;
                this.framesDrawn = 0;
            }

    }
    //Used in the event of a collision
    getPreviousXandY()
    {
        this.previousXCoord = this.xCoord;
        this.previousYCoord = this.yCoord;
    }
}
class Background extends ImageClass
{
    constructor (src, height, width, canvasID ,collisionArray,tileSize)
    {
        super (src, height, width, canvasID )
        this.collisionArray = collisionArray;
        this.yCoord = 0;
        this.xCoord = 0;
        this.tileSize = tileSize;
        this.gridRows = 20;
        this.gridCols = 41;
    }
    addmap()
    {
        playerAreaCanvas.ctx.drawImage(background.imageElement, 0, 0);
    }
    addCollisionDetection()
    {
        for (let eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (let eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow * this.gridRows + eachCol; //loops through each element in array, checks if 1 or 0
                if(this.collisionArray[arrayIndex] == 1)
                {
                    playerAreaCanvas.ctx.fillRect(userSprite.xCoord, userSprite.yCoord, 10,10);
                    let wall = new Wall(32*eachCol, 32*eachRow);
                    wall.isCollision(wall,userSprite); 
                }
            }
        }   


    }

}
class Wall 
{
    constructor (xCoord,yCoord)
    {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.height = 32;
        this.width  = 32;
    }
    isCollision(rect1, rect2)
    {
        playerAreaCanvas.ctx.fillRect(rect1.xCoord, rect1.yCoord,rect1.width,rect1.height);
        if (rect1.xCoord == rect2.xCoord && rect1.yCoord == rect2.yCoord)
        {
            console.log('full equality');


        }
        if (
            rect1.xCoord < rect2.xCoord + rect2.width &&
            rect1.xCoord + rect1.width > rect2.xCoord &&
            rect1.yCoord < rect2.yCoord + rect2.height &&
            rect1.yCoord + rect1.height > rect2.yCoord
            )
          {
                console.log('here')
                rect2.xCoord = rect2.previousXCoord;
                rect2.yCoord = rect2.previousYCoord;      
           } 
    }

}
const animationInformation = 
{
    walkUp: {totalFrame: 7, spriteRow: 8},
    walkLeft:{totalFrame: 7, spriteRow: 9},
    walkDown:{totalFrame: 7, spriteRow: 10},
    walkRight: {totalFrame: 7, spriteRow: 11},
    crouch: {},
    punchUp: {},
    punchDown: {},
    punchLeft: {},
    punchRight: {}
}
const playerAreaCanvas = new Canvas ("playerArea", 1400, 800);
playerAreaCanvas.getCanvasMade();

const userSprite = new MoveableImage("assets/playerspritesheet.png",1158,63,0,0,64,64,"playerArea",3);
userSprite.createImageElement();

const background = new Background("assets/tilesets/testfirst.png",1000, 600, "playerArea",collisionArray, 32);
background.createImageElement();
let numOfImages = 1;

function addmap()
{
    playerAreaCanvas.ctx.drawImage(background.imageElement, 0, 0);
}




function updatePlayerArea() 
{
    //clear the screen
    playerAreaCanvas.ctx.clearRect(0,0,playerAreaCanvas.width, playerAreaCanvas.height); // So the contents of the previous frame can be cleared
    //add in the background
    addmap();
    //add in items and furniture
    //add in NPCs
    //add in the user
    userSprite.animate();
    background.addCollisionDetection();
    requestAnimationFrame(updatePlayerArea); //The function will be called repeatedly on each new frame

}

document.addEventListener("keydown", e => {
    userSprite.getPreviousXandY();

    userSprite.animateBoolean = true;
    let spriteHeight = userSprite.height;
    let spriteSpeed = userSprite.speed;
    if(e.key === "ArrowLeft")
    {
        userSprite.srcY = 9 * spriteHeight;
        userSprite.xCoord = userSprite.xCoord - spriteSpeed;
    }
    else if(e.key === "ArrowRight")
    {
       userSprite.srcY = 11 * spriteHeight;
       userSprite.xCoord = userSprite.xCoord + spriteSpeed;
    }  
    else if (e.key == "ArrowDown")
    {
        userSprite.srcY = 10 * spriteHeight;

        userSprite.yCoord = userSprite.yCoord + spriteSpeed;
    }
    else if (e.key == "ArrowUp")
    {
        userSprite.srcY = 8 * spriteHeight;
        userSprite.yCoord = userSprite.yCoord - spriteSpeed;
    }
    else if (e.key == "q" )
    {
        userSprite.srcY = 20 * spriteHeight;
        userSprite.totalFrames = 4;
    }
});
document.addEventListener("keyup", e => 
{
    userSprite.animateBoolean = false;
})


window.onload = () =>
{

    updatePlayerArea();
}



