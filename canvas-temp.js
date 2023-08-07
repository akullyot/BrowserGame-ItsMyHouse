const canvas = document.getElementById('canvas');
canvas.width = 1300;
canvas.height = 630;
const ctx = canvas.getContext('2d');


const tileWidth = 32;
const tileHeight = 32;
const gridRows = 41; //will have to remove
const gridCols = 17;
// 0 cant pass through
// 1 can pass through
const map = collisionMapArray;



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
        if (
            rect1.xCoord < rect2.xCoord + rect2.width &&
            rect1.xCoord + rect1.width > rect2.xCoord &&
            rect1.yCoord < rect2.yCoord + rect2.height &&
            rect1.yCoord + rect1.height > rect2.yCoord
            )
          {
                rect2.xCoord = rect2.previousXCoord;
                rect2.yCoord = rect2.previousYCoord;
          } 
    }
}

class Player
{
    constructor (xCoord,yCoord,src)
    {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.previousXCoord = null;
        this.previousYCoord = null;
        this.height = 50;
        this.width  = 32;
        this.speed = 2;
        this.src = src
    }
    draw()
    {
        let image = new Image();
        image.src = "assets/basicHermit.png";
        ctx.drawImage(image, this.xCoord, this.yCoord);
    }
    
    move ()
    {
        if(keys.ArrowUp && this.yCoord > 0)
        {
            this.yCoord -= this.speed
        }
        if(keys.ArrowDown && this.yCoord < (canvas.height - this.height))
        {
            this.yCoord += this.speed
        }
        if(keys.ArrowLeft && this.xCoord > 0)
        {
            this.xCoord -= this.speed
        }
        if(keys.ArrowRight && (this.xCoord < (canvas.width - this.width) ))
        {
            this.xCoord += this.speed
        }
    }
    getPreviousXandY()
    {
        console.log('first')
        this.previousXCoord = this.xCoord;
        this.previousYCoord = this.yCoord;
    }

}
//debugging baselayer size
function copyImageToCanvas(relativeSrc)
{
    let image = new Image();
    image.src = relativeSrc;
    ctx.drawImage(image, 0,0);     
}


const updateAll = () =>
{

    window.requestAnimationFrame(updateAll); //makes a continous loop 
    //NOTE this is temp
    drawMap();
  //copyImageToCanvas("assets/tilesets/testfirst.png");
    player.draw();
    player.getPreviousXandY()
    player.move();
}

//sometimes a loadign race, therefore
window.onload = () =>
{

    window.requestAnimationFrame(updateAll);
}
const keys = 
{
    ArrowUp: false,
    ArrowDown : false,
    ArrowLeft: false,
    ArrowRight: false
} //trigger boolean flags
window.addEventListener('keydown', (e) =>{
    keys[e.key] = true;
})
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
})

const player = new Player(0,0);

const drawMap = () =>
{
    for (let eachRow = 0; eachRow < gridRows; eachRow++ )
    {
        for (let eachCol = 0; eachCol < gridCols; eachCol++ )
        {
            let arrayIndex = eachRow * gridRows + eachCol; //loops through each element in array, checks if 1 or 0
            if(map[arrayIndex] == 1)
            {
                let wall = new Wall(tileWidth*eachCol, tileHeight*eachRow )
                wall.isCollision(wall,player) //TODO read collision map
            }
        }
    }   
}

