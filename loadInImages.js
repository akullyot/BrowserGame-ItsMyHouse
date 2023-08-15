//Purpose: load in every image used by the player canvas
//         And Create the playerAreaCanvas requestAnimationFrame infinite looper


//Used in creating the canvases
const fullAreaWidth = 960;
const fullAreaHeight = 480;
const widthAddition = 352;
const heightAddition = 100;

const playerAreaCanvas = new Canvas ("playerArea", fullAreaWidth, fullAreaHeight, "firstFloor");
playerAreaCanvas.getCanvasMade();

//Add in the image of the user Sprite
const userSprite = new MoveableImage("assets/spriteSheets/playerspritesheet.png", 56,7,0,0,64,64,"playerArea",5);
userSprite.createImageElement();
userSprite.createWeaponImageElement();


//Add in the images of the NPC sprites
const ladyNPCSprite = new NonPlayableCharacter("assets/spriteSheets/ladySpriteSheet.png",721,211,0,0,64,64,"playerArea","pathOne", "down", "firstFloor");
ladyNPCSprite.createImageElement();

const manNPCSprite = new NonPlayableCharacter("assets/spriteSheets/manSpriteSheet.png",525,218,0,0,64,64,"playerArea","pathOne", "down", "secondFloor"); 
manNPCSprite.createImageElement();

const childNPCSprite = new NonPlayableCharacter("assets/spriteSheets/childSpriteSheet.png",210,182,0,0,64,64,"playerArea","pathOne", "down", "basement");
childNPCSprite.createImageElement();


//Add in the dialogue popups for the NPC 
const startledDialog = new ImageClass ("assets/spriteSheets/scaredNPC.png",null, null, 32,32,"playerArea");
startledDialog.createImageElement();
const warningDialog = new ImageClass ("assets/spriteSheets/warningNPC.png",null, null, 32,32,"playerArea");
warningDialog.createImageElement();


//Add in the backgrounds for each floor
const firstFloorBackground = new Background("assets/firstFloor/firstfloor.png",1000, 600, "playerArea",firstFloorMaps, 32);
firstFloorBackground.createImageElement();
const basementBackground = new Background("assets/basement/basement.png",1000, 600, "playerArea",basementMaps, 32);
basementBackground.createImageElement();
const secondFloorBackground = new Background("assets/secondFloor/secondFloor.png",1000, 600, "playerArea",secondFloorMaps, 32);
secondFloorBackground.createImageElement();



//Add in all the interactable items 
//First Floor
const stove = new InteractableItem('assets/firstFloor/Items/stove.png', 638, 193, 32,32, true,false, false);
stove.createImageElement();
const fridge = new InteractableItem('assets/firstFloor/Items/fridge.png', 672, 160, 32*2,32, false ,true, false, [])
fridge.createImageElement();

const bookshelfLeft = new InteractableItem('assets/firstFloor/Items/bookshelf.png', 5, 140, 32*2,32*2, false, false, false)
bookshelfLeft.createImageElement();
const bookshelfRight = new InteractableItem('assets/firstFloor/Items/bookshelf.png', 75, 140, 32*2,32*2, false,false, false)
bookshelfRight.createImageElement();

const chairRightDown = new DraggableItem('assets/firstFloor/Items/chairleft.png', 170, 270, 20,20)
chairRightDown.createImageElement();
const chairRightUp= new DraggableItem('assets/firstFloor/Items/chairleft.png', 170, 320, 20,20)
chairRightUp.createImageElement();


const vanity = new InteractableItem('assets/firstFloor/Items/vanity.png', 480, 170, 40,40, false,true, false, ['candy', 'candle'])
vanity.createImageElement();
const dresserLeft  = new InteractableItem('assets/firstFloor/Items/dresser.png', 155, 90, 40,40, true,true,false, ["candy"]);
dresserLeft.createImageElement();
const dresserRight  = new InteractableItem('assets/firstFloor/Items/dresser.png', 420, 90, 40,40, true,true,false, ["candy"]);
dresserRight.createImageElement();

const toilet = new InteractableItem('assets/firstFloor/Items/toilet.png', 830, 70, 32*2,32, true,false,false);
toilet.createImageElement();

const book = new InteractableItem("assets/questItems/book.png", 53,310,40,32, false, false, true, ['book']);
book.createImageElement();
// Second Floor

const doll = new DraggableItem("assets/questItems/doll.png", 200,220, 32,32);
doll.createImageElement();

const dresserSecond  = new InteractableItem('assets/firstFloor/Items/dresser.png', 480, 170, 40,40, true,true,false, ["candy", "mace"]);
dresserSecond.createImageElement();

const stereo = new InteractableItem('assets/secondFloor/Items/speaker.png', 355, 80, 60,30, true,false,false);
stereo.createImageElement();
const mirror = new InteractableItem('assets/secondFloor/Items/mirror.png', 700, 258, 32,32, true,false,false);
mirror.createImageElement();

//Basement









function updatePlayerArea() 
{
    //clear the screen
    playerAreaCanvas.ctx.clearRect(0,0,playerAreaCanvas.width, playerAreaCanvas.height); // So the contents of the previous frame can be cleared
    //add in the background
    //Switch the floor accordingly 
    switch(playerAreaCanvas.floor)
    {
        case 'firstFloor':
            firstFloorBackground.addmap();
            //add furniture
            vanity.drawFurniture();
            vanity.isClose(userSprite);
            dresserLeft.drawFurniture();
            dresserLeft.isClose(userSprite);
            dresserRight.drawFurniture();
            dresserRight.isClose(userSprite);

            bookshelfLeft.drawFurniture();
            bookshelfRight.drawFurniture();
            
            chairRightDown.drawDraggableFurniture();    
            chairRightUp.drawDraggableFurniture(); 


            stove.drawFurniture();
            stove.isClose(userSprite);
            fridge.drawFurniture();
            fridge.isClose(userSprite);
            toilet.drawFurniture();
            toilet.isClose(userSprite);
            // add in items
            if (book.itemsInside.length !== 0)
            {
                book.drawFurniture();
                book.isClose(userSprite);
            }
           
        
            //add in NPCs
            ladyNPCSprite.animate();
            ladyNPCSprite.path();
            ladyNPCSprite.detectPlayerNearby();

            //add in the user 
            userSprite.animate();
            //darken behind the walls
            firstFloorBackground.darkenBehindTheWalls();
            break;
        case 'basement':
            basementBackground.addmap();
            //add in NPCs
            childNPCSprite.animate();
            childNPCSprite.path();
            childNPCSprite.detectPlayerNearby();

            userSprite.animate();
            //darken behind the walls
            basementBackground.darkenBehindTheWalls();
            break;
        case 'secondFloor':
            secondFloorBackground.addmap();
            //add in furniture
            //rummagable
            dresserSecond.drawFurniture();
            dresserSecond.isClose(userSprite);
            //breakable (stereo is a special type of breakable)
              stereo.drawFurniture();
              stereo.isClose(userSprite);
              mirror.drawFurniture();
              mirror.isClose(userSprite);

            //pickupable
            doll.drawDraggableFurniture();
           

            //add in NPCs
            manNPCSprite.animate();
            manNPCSprite.path();
            manNPCSprite.detectPlayerNearby();
            //add in the user
            userSprite.animate();

            //darken behind the walls
            secondFloorBackground.darkenBehindTheWalls();
            break;
        case "transition" :
            playerAreaCanvas.transition();
            break;
        case "lost":
            break;
        case "won":
            break;

    }
    requestAnimationFrame(updatePlayerArea); //The function will be called repeatedly on each new framed
}
