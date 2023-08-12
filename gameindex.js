
class Canvas
{
    constructor(canvasID, width, height)
    {
        this.width         = width;
        this.height        = height;
        this.canvasID      = canvasID;
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
        this.imageElement = image;
    }
    drawImage()
    {
        if (this.imageElement === null)
        {
            console.warn('you are trying to work with an image element you have not created. run classInstanceName.createImageElement() and/or check your promise All.')
        }
        //in information stats we repeat pictures
        if (this.xCoord.length > 0)
        {
           for (let i=0; i< this.xCoord.length; i++)
           {
                document.getElementById(this.canvasID).getContext('2d').drawImage(this.imageElement,this.xCoord[i], this.yCoord[i]);
           }
        }
        else
        {
            document.getElementById(this.canvasID).getContext('2d').drawImage(this.imageElement,this.xCoord, this.yCoord);
        }
    }
}
//TODO change name, it also includes pickupable items
class InteractableItem extends ImageClass
{
    constructor (src, xCoord, yCoord, height, width,isBreakable,isOpenable,isPickupItem,itemsInside)
    {
        super(src,xCoord,yCoord,height, width);
        this.isBreakable    = isBreakable;
        this.isOpenable     = isOpenable;  
        this.isPickupItem   = isPickupItem; 
        this.itemsInside    = itemsInside; 
        
    }
    drawFurniture()
    {
        //note: need to create an image before using
        playerAreaCanvas.ctx.drawImage(this.imageElement, this.xCoord, this.yCoord);

    }
    isClose(player)
    {

        if (
            this.xCoord < player.xCoord + (player.width -player.heightAndWidthAllowance)  &&
            this.xCoord + this.width > player.xCoord + player.heightAndWidthAllowance  &&
            this.yCoord < player.yCoord + (player.height) &&
            this.yCoord + this.height > (player.yCoord + player.heightAndWidthAllowance)
            )
        {
            player.placeholderCoordx = player.xCoord;
            player.placeholderCoordy = player.yCoord;
            player.xCoord = player.previousXCoord;
            player.yCoord = player.previousYCoord;
            TextCanvas.hasbeenRewritten = 'true';

            player.byFurniture = true;
            player.Furnitureby = this;
            if (this.isOpenable)
            {

                TextCanvas.rewriteText('openingFurniture');

            }
            else if (this.isPickupItem)
            {
                TextCanvas.rewriteText('pickingUpItem');
            }
        }
        else if (
                player.yCoord == player.previousYCoord && player.xCoord == player.previousXCoord &&
                this.xCoord < player.placeholderCoordx + (player.width -player.heightAndWidthAllowance)  &&
                this.xCoord + this.width > player.placeholderCoordx + player.heightAndWidthAllowance  &&
                this.yCoord < player.placeholderCoordy + (player.height) &&
                this.yCoord + this.height > (player.placeholderCoordy + player.heightAndWidthAllowance)
                )
        {
                //not sure why player wasnt working
                player.byFurniture = true;
                player.Furnitureby = this;
                this.changeColorWhenPlayerClose();
                TextCanvas.hasbeenRewritten = true;
                //so that on pressing e it doesnt reset
                if (TextCanvas.currentText  == allPlayerOptions.openingFurniture)
                {
                    if (this.isOpenable)
                    {
                        TextCanvas.rewriteText('openingFurniture');  
                    }
                    else if (this.isPickupItem)
                    {
                        TextCanvas.rewriteText('pickingUpItem');
                    }

                }

        }
        else if((player.byFurniture && player.yCoord !== player.previousYCoord) || (player.byFurniture && player.xCoord !== player.previousXCoord))
        {

                player.byFurniture = false;
                player.Furnitureby = null;
                player.placeholderCoordx = null;
                player.placeholderCoordy = null;
                if (TextCanvas.hasbeenRewritten)
                {
                    if (this.isOpenable)
                    {
                        TextCanvas.rewriteText('returnToText');
                    }
                    else if (this.isPickupItem)
                    {
                        TextCanvas.rewriteText('returnToText');
                    }
                    TextCanvas.hasbeenRewritten = false;
                }
        }
    }
    changeColorWhenPlayerClose()
    {
        //TODO change color based on what you can do with it 
        playerAreaCanvas.ctx.fillStyle = 'rgba(245,152,39,0.2)';
        playerAreaCanvas.ctx.fillRect(this.xCoord,this.yCoord,this.width,this.height);
    }
}
class MoveableImage extends ImageClass
{
    constructor (src, xCoord, yCoord,srcX,srcY,height,width,canvasID,speed,)
    {
        super (src, xCoord, yCoord,height,width,canvasID);
        this.speed                     = speed;
        this.hasWeapon                 = false;
        this.hasCandle                 = false;
        this.hasBook                   = false;  
        //used for spritesheet selection
        this.srcX                      = srcX;
        this.srcY                      = srcY;
        //used for proper animation
        this.animateBoolean            = false;
        this.framesDrawn               = 0;
        this.totalFrames               = 7;
        this.currentFrame              = 0;
        //used for collision detection    
        this.previousXCoord            = null;
        this.previousYCoord            = null;
        this.heightAndWidthAllowance   = 30; 
        //for door detection
        this.placeholderCoordx         = null;
        this.placeholderCoordy         = null;
        //used for displaying the correct movement options
        this.byDoor                    = false;
        this.byFurniture               = false;
        //gives the object name you are by for interacting purposes 
        this.Furnitureby               = null;
            //turns off collision door detection when going through
        this.usingDoor                 = null;
    }
    //Purpose: Move through the sprite sheet of your character to animate movement correctly
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
    //Purpose: As the player moves, keep track of their previous location for the purpose of collision detection
    getPreviousXandY()
    {
        this.previousXCoord = this.xCoord;
        this.previousYCoord = this.yCoord;
    }
    //Purpose: Move through paintings
    //Notes: called on q click event only if this.byDoor = true
    async moveThroughPainting()
    {
        let direction = previousWalkingDirection;
        this.usingDoor = true;
        moveThroughPaintingSoundElement.play();
        setTimeout(() => {
        switch (direction)
            {
                case 'left' :
                    this.xCoord =  this.xCoord - 100; //2 tiles with a bit of wiggle room 
                case'right':
                    this.xCoord =  this.xCoord + 100; //2 tiles with a bit of wiggle room 
                case 'up'   :
                    //TODO this is hacky and something weird is happening
                    if (this.xCoord < 400)
                    {
                        this.yCoord = 170;
                    }
                    else
                    {
                        this.yCoord =-25; // this one is very weird. i dont know what its doing. I want this.yCoord - 120 but it doesnt work
                    }
                case 'down' :   
                    this.yCoord = this.yCoord + 120; //2 tiles with a bit of wiggle room 
            }
        }, 0);




    }

}
class Background extends ImageClass
{
    constructor (src, height, width, canvasID ,mapArrayObject,tileSize,floor)
    {
        super (src, height, width, canvasID )
        this.mapArrayObject  = mapArrayObject;
        this.yCoord          = 0;
        this.xCoord          = 0;
        this.tileSize        = tileSize;
        this.gridRows        = 15;
        this.gridCols        = 30;
        this.floor           = floor;
    }
    addmap()
    {
        playerAreaCanvas.ctx.drawImage(this.imageElement, 0, 0);
        this.addCollisionDetection(this.mapArrayObject.collisionArray);
        this.addDoorDetection(this.mapArrayObject.doorArray);
    }
    // Purpose: never actually used because I cant figure out the callback, but the idea
    //          was for mapping to set up the tile map to canvas map looping
    mapLooper(array, functionDoingTheThing)
    {
        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(array[arrayIndex] == 1)
                {
                    functionDoingTheThing();
                }
            }
        }   
    }
    //Purpose: detects when a player runs into a wall and prevents them from moving by 
    //         resetting
    //Argument: this.mapArrayObject.collisionArray
    addCollisionDetection(array)
    {

        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(array[arrayIndex] == 1)
                {
                    let wall = new Wall(this.tileSize * eachCol, this.tileSize * eachRow);
                    wall.isCollision(wall,userSprite); 
                }
            }
        }   
    }
    //Purpose: add a black filter with opacity to the inside of walls to give a darkened effect
    // Argument: this.mapArrayObject.insidewalls
    darkenBehindTheWalls(array)
    {
        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(array[arrayIndex] == 1)
                {
                    let fillerxCoord = this.tileSize * eachCol;
                    let  filleryCoord = this.tileSize * eachRow;
                    //when a candle is present, do collision detection and dont fill in those as brightly 
                    if (userSprite.hasCandle)
                    {
                        if(
                            fillerxCoord < userSprite.xCoord + (userSprite.width -userSprite.heightAndWidthAllowance)  &&
                            fillerxCoord + this.tileSize > userSprite.xCoord + userSprite.heightAndWidthAllowance  &&
                            filleryCoord < userSprite.yCoord + (userSprite.height) &&
                            filleryCoord + this.tileSize > (userSprite.yCoord + userSprite.heightAndWidthAllowance)
                        )
                        {
                            playerAreaCanvas.ctx.fillStyle = 'rgba(0,0,0,0.5w)';
                            playerAreaCanvas.ctx.fillRect(fillerxCoord, filleryCoord, (this.tileSize), this.tileSize);
                        }
                        else
                        {
                            playerAreaCanvas.ctx.fillStyle = 'rgba(0,0,0,0.6)';
                            playerAreaCanvas.ctx.fillRect(fillerxCoord, filleryCoord, this.tileSize, this.tileSize);
                        }


                    }
                    else
                    {
                        playerAreaCanvas.ctx.fillStyle = 'rgba(0,0,0,0.6)';
                        playerAreaCanvas.ctx.fillRect(fillerxCoord, filleryCoord, this.tileSize, this.tileSize);
                    }
                }
            }
        }   
    }
    // Purpose: take the locations of the doors and add collision detection plus
    //          the subsequent option to press q to move through
    addDoorDetection(array)
    {
        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(array[arrayIndex] == 1)
                {
                    //create a door element
                    let door = new Door(this.tileSize * eachCol, this.tileSize * eachRow);
                    door.isDoorCollision(door,userSprite); 
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
    isCollision(wall, player)
    {
        if (
            wall.xCoord < player.xCoord + (player.width -player.heightAndWidthAllowance)  &&
            wall.xCoord + wall.width > player.xCoord + player.heightAndWidthAllowance  &&
            wall.yCoord < player.yCoord + (player.height) &&
            wall.yCoord + wall.height > (player.yCoord + player.heightAndWidthAllowance)
            )
            {
                player.xCoord = player.previousXCoord;
                player.yCoord = player.previousYCoord;      
            } 
    }

}
class Door extends Wall
{
    constructor(xCoord,yCoord)
    {
        super(xCoord, yCoord)
        this.height = 32;
        this.width  = 32;
    }
    isDoorCollision(wall, player)
    {
        if (!player.usingDoor)
        {
            if (
                wall.xCoord < player.xCoord + (player.width -player.heightAndWidthAllowance)  &&
                wall.xCoord + wall.width > player.xCoord + player.heightAndWidthAllowance  &&
                wall.yCoord < player.yCoord + (player.height) &&
                wall.yCoord + wall.height > (player.yCoord + player.heightAndWidthAllowance)
                )
                {
                    player.placeholderCoordx = player.xCoord;
                    player.placeholderCoordy = player.yCoord;
                    player.xCoord = player.previousXCoord;
                    player.yCoord = player.previousYCoord;     
                    //write in the correct Text
                    //now you need to register those previous coords as options where you 
                    //can pass through and the text content changes 
                    //check that its not a repeat 
                    TextCanvas.hasbeenRewritten = true;
                    TextCanvas.rewriteText('byDoor');
                    player.byDoor = true;   
                }
            else if (
                player.yCoord == player.previousYCoord && player.xCoord == player.previousXCoord &&
                wall.xCoord < player.placeholderCoordx + (player.width -player.heightAndWidthAllowance)  &&
                wall.xCoord + wall.width > player.placeholderCoordx + player.heightAndWidthAllowance  &&
                wall.yCoord < player.placeholderCoordy + (player.height) &&
                wall.yCoord + wall.height > (player.placeholderCoordy + player.heightAndWidthAllowance)
                )
            {
                TextCanvas.hasbeenRewritten = true;
                TextCanvas.rewriteText('byDoor');
                player.byDoor = true;   
            }
            else if((player.byDoor && player.yCoord !== player.previousYCoord) || (player.byDoor && player.xCoord !== player.previousXCoord))
            {
                player.byDoor = false; 
                player.placeholderCoordx = null;
                player.placeholderCoordy = null;
                if (TextCanvas.hasbeenRewritten)
                {
                    TextCanvas.rewriteText('returnToText');
                    TextCanvas.hasbeenRewritten = false;
                }
            }
    }
}
}


const fullAreaWidth = 960;
const fullAreaHeight = 480;
const widthAddition = 352;
const heightAddition = 100;

const playerAreaCanvas = new Canvas ("playerArea", fullAreaWidth, fullAreaHeight);
playerAreaCanvas.getCanvasMade();

const userSprite = new MoveableImage("assets/spriteSheets/playerspritesheet.png",56,7,0,0,64,64,"playerArea",7);
userSprite.createImageElement();

const firstFloorBackground = new Background("assets/firstFloor/firstfloor.png",1000, 600, "playerArea",firstFloorMaps, 32);
firstFloorBackground.createImageElement();

const vanity = new InteractableItem('assets/firstFloor/Items/vanity.png', 480, 170, 32*2,32*2, false,true, false, ['candy', 'candle'])
vanity.createImageElement();
const stove = new InteractableItem('assets/firstFloor/Items/stove.png', 638, 193, 32,32, true,false, false);
stove.createImageElement();
const fridge = new InteractableItem('assets/firstFloor/Items/fridge.png', 672, 160, 32*2,32, false ,true, false, [])
fridge.createImageElement();


const bookshelfLeft = new InteractableItem('assets/firstFloor/Items/bookshelf.png', 5, 140, 32*2,32*2, false, false, false)
bookshelfLeft.createImageElement();
const bookshelfRight = new InteractableItem('assets/firstFloor/Items/bookshelf.png', 75, 140, 32*2,32*2, false,false, false)
bookshelfRight.createImageElement();

const chairLeftUp = new InteractableItem('assets/firstFloor/Items/chairleft.png', 170, 270, 32*2,32, true,false,false)
chairLeftUp.createImageElement();
const chairLeftDown = new InteractableItem('assets/firstFloor/Items/chairleft.png', 170, 320, 32*2,32, true,false,false)
chairLeftDown.createImageElement();
const chairRightUp= new InteractableItem('assets/firstFloor/Items/chairRight.png', 280, 270, 32*2,32, true,false,false)
chairRightUp.createImageElement();
const chairRightDown= new InteractableItem('assets/firstFloor/Items/chairRight.png', 280, 320, 32*2,32, true,false,false)
chairRightDown.createImageElement();

const dresserLeft  = new InteractableItem('assets/firstFloor/Items/dresser.png', 155, 90, 32,32*2, true,true,false, ["candy"]);
dresserLeft.createImageElement();
const dresserRight  = new InteractableItem('assets/firstFloor/Items/dresser.png', 420, 90, 32,32*2, true,true,false, ["candy"]);
dresserRight.createImageElement();

const toilet = new InteractableItem('assets/firstFloor/Items/toilet.png', 830, 70, 32*2,32, true,false,false);
toilet.createImageElement();

const book = new InteractableItem("assets/questItems/book.png", 53,310,40,32, false, false, true, ['book']);
book.createImageElement();
 //TODO not sure if i actually need this
//purpose: helps with slotting and picking up inventory items
//allInventoryItems["book"] = book;


function updatePlayerArea() 
{
    //clear the screen
    playerAreaCanvas.ctx.clearRect(0,0,playerAreaCanvas.width, playerAreaCanvas.height); // So the contents of the previous frame can be cleared
    //add in the background
    firstFloorBackground.addmap();
    //add furniture
    vanity.drawFurniture();
    vanity.isClose(userSprite);
    bookshelfLeft.drawFurniture();
    bookshelfRight.drawFurniture();
    chairLeftDown.drawFurniture();
    chairLeftDown.isClose(userSprite);
    chairLeftUp.drawFurniture();
    chairLeftUp.isClose(userSprite);    
    chairRightDown.drawFurniture();
    chairRightDown.isClose(userSprite);
    chairRightUp.drawFurniture(); 
    chairRightUp.isClose(userSprite);
    dresserLeft.drawFurniture();
    dresserLeft.isClose(userSprite);
    dresserRight.drawFurniture();
    dresserRight.isClose(userSprite);
    stove.drawFurniture();
    stove.isClose(userSprite);
    fridge.drawFurniture();
    fridge.isClose(userSprite);
    toilet.drawFurniture();
    toilet.isClose(userSprite);
    // add in items
    book.drawFurniture();
    book.isClose(userSprite);
   

    //add in NPCs
    //add in the user
    if (userSprite.hasCandle)
    {
        firstFloorBackground.darkenBehindTheWalls(firstFloorBackground.mapArrayObject.insideWallArray);
    }
    userSprite.animate();
    //darken behind the walls
    if (!userSprite.hasCandle)
    {
        firstFloorBackground.darkenBehindTheWalls(firstFloorBackground.mapArrayObject.insideWallArray);
    }
    requestAnimationFrame(updatePlayerArea); //The function will be called repeatedly on each new framed
}




