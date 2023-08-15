// Purpose       : create a canvas HTML element. This also includes functionality for displaying transition animations, such as stair movements or win/lsoe animations
// Instantiations: PlayerAreaCanvas
// ChildClasses  : ClickableCanvas,InventoryCanvas
class Canvas
{
    constructor(canvasID, width, height, floor)
    {
        this.width           = width;
        this.height          = height;
        this.canvasID        = canvasID;
        //used once you instantiate the canvas
        this.canvasElement   = null; 
        //used once you instantiate the canvas 
        this.ctx             = null; 
        //used for switching playerarea canvas floor displays and transition/win/lose states
        this.floor           = floor; 
        this.tileSize        = 32;
        //used in the actual creation of preset animations
        //sets the timer tracker for filling in the 
        this.transitionCount  = 0;
        this.transitionWidth  = 32;
        this.transitionHeight = 32;
        this.transitionFloor  = null;
    }
    //Purpose: grab the canvas element from HTML is js and create a parametre for the context
    getCanvasMade()
    {
        this.canvasElement = document.getElementById(this.canvasID);
        this.ctx = this.canvasElement.getContext('2d');
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
    }
    //Purpose: creating the actual animation used when transitioning between floors
    //Note   : this is basic, could be improved
    transition()
    {
        //get correct floor to show 
        let backgroundImage = null;
        switch (playerAreaCanvas.transitionFloor)
        {
            case "firstFloor":
                //Turn off the stereo just in case 
                stereoSoundElement.pause();
                backgroundImage = firstFloorBackground.imageElement;
                break;
            case "secondFloor":
                stereoSoundElement.pause();
                backgroundImage = secondFloorBackground.imageElement;
                break;           
            case "basement":
                stereoSoundElement.pause();
                backgroundImage = basementBackground.imageElement;
                break;
        }
        if (this.transitionWidth > fullAreaWidth && this.transitionHeight > fullAreaHeight)
        {
            this.transitionWidth = 32;
            this.transitionHeight = 32;
            this.transitionCount = 0;
            this.floor = this.transitionFloor;
            this.transitionFloor = null;
        }
        else
        {
            //every ten counts increase the width
            if (this.transitionCount > 1)
            {
                this.transitionWidth = this.transitionWidth + 32;
                this.transitionHeight = this.transitionHeight + 16;
                this.transitionCount = 0;
            } 
            this.ctx.fillStyle = "rgba(0,0,0,0.7)"
            this.ctx.drawImage(backgroundImage, 0, 0, this.transitionWidth, this.transitionHeight, 0, 0, this.transitionWidth, this.transitionHeight);
            this.ctx.fillRect(0,0,this.transitionWidth,this.transitionHeight);
            this.transitionCount++
        }
    }
}

// Purpose        : The most basic Image class.  All items drawn onto any canvas are included in this base class.
// Instantiations :
// ChildClasses   :
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
        this.tileSize      = 32; //cahnge if tile size cahnges 
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
// Purpose        :
// Instantiations :
// ChildClasses   : Note: this ideally should be extended but has not been due to time constraints/not the best plannign
class InteractableItem extends ImageClass
{
    constructor (src, xCoord, yCoord, height, width,isBreakable,isOpenable,isPickupItem,itemsInside)
    {
        super(src,xCoord,yCoord,height, width);
        //there are different typres of furnitures with different functionalities that are
        //turned on and off with booleans
        this.isBreakable    = isBreakable;
        //these are items on the floor that you can pick up and add to inventory   
        this.isPickupItem   = isPickupItem; 
        //these are desks/drawers you can rummage through
        this.isOpenable     = isOpenable;
        //THIS APPLIES to both isPickupItem and isOpenable. this is an array of the item itself/ the items inside. 
        // Note: this will reset each time you reload a floor except for pickup items and quest items 
        this.itemsInside    = itemsInside;    
    }
    drawFurniture()
    {
        //note: need to create an image before using
        playerAreaCanvas.ctx.drawImage(this.imageElement, this.xCoord, this.yCoord);
    }
    isClose(player)
    {
        //helper function:
        //Purpose: writing out all the text dialogue options because it is used both at the initial hitting and colliding back
        //TODO helper function for the dialogue selection
        //use the proper hitbox dimensions
        let playerDimensions = player.getProperHitboxDimensions();

        if (
            this.xCoord < playerDimensions.xCoord + playerDimensions.width  &&
            this.xCoord + this.width > playerDimensions.xCoord   &&
            this.yCoord < playerDimensions.yCoord + playerDimensions.height &&
            this.yCoord + this.height > playerDimensions.yCoord
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
            //Specifically for the breaker box and stereo, they have custom messages. Ideally I would have changed the class system to compensate
            else if (stereo.isBreakable)
            {
                TextCanvas.rewriteText("stereo")
            }
            else if (breakerBox.isBreakable)
            {
                TextCanvas.rewriteText("breakerBox")
            }
            else if (this.isBreakable)
            {
                TextCanvas.rewriteText("breakingItem")
            }
        }
        else if (
            player.yCoord == player.previousYCoord && player.xCoord == player.previousXCoord &&
            this.xCoord < player.placeholderCoordx + (playerDimensions.width)  &&
            this.xCoord + this.width > player.placeholderCoordx   &&
            this.yCoord < player.placeholderCoordy + (playerDimensions.height) &&
            this.yCoord + this.height > (player.placeholderCoordy)
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
                    else if (stereo.isBreakable)
                    {
                        TextCanvas.rewriteText("stereo")
                    }
                    else if (breakerBox.isBreakable)
                    {
                        TextCanvas.rewriteText("BreakerBox")
                    }
                    else if (this.isBreakable)
                    {
                        TextCanvas.rewriteText("BreakingItem")
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
        playerAreaCanvas.ctx.fillStyle = 'rgba(245,152,39,0.5)';
        playerAreaCanvas.ctx.fillRect(this.xCoord +5 ,this.yCoord + 5,this.width,this.height);
    }
}
class DraggableItem extends InteractableItem
{
    constructor(src, xCoord, yCoord, height, width)
    {
        super(src,xCoord,yCoord,height, width)
        //this is always true, its for keypress event recognition because other item types also use 
        // userSprite.FurnitureBy and userSprite.byFurniture
        this.isDraggable    = true;
        this.isBeingDragged = false;
        this.startingX      = null;
        this.startingY      = null;
        this.endingX        = null;
        this.endingY        = null;
        this.dragCount      = 0;
        this.hasCompleted   = false;
    }
    //theres enough changes where it makes sense to rewrite is close
    //Purpose: trigger the correct textbox and option to pickup furniture
    isNearby(player)
    {
        let playerDimensions = player.getProperHitboxDimensions();
        if (
            this.xCoord < playerDimensions.xCoord + playerDimensions.width  &&
            this.xCoord + this.width > playerDimensions.xCoord   &&
            this.yCoord < playerDimensions.yCoord + playerDimensions.height &&
            this.yCoord + this.height > playerDimensions.yCoord
            )
        {
            player.placeholderCoordx = player.xCoord;
            player.placeholderCoordy = player.yCoord;
            player.xCoord = player.previousXCoord;
            player.yCoord = player.previousYCoord;
            TextCanvas.hasbeenRewritten = 'true';
            player.byFurniture = true;
            player.Furnitureby = this;
            TextCanvas.rewriteText('dragItem');
            this.changeColorWhenPlayerClose();

        }
        else if (
                player.yCoord == player.previousYCoord && player.xCoord == player.previousXCoord &&
                this.xCoord < player.placeholderCoordx + (playerDimensions.width)  &&
                this.xCoord + this.width > player.placeholderCoordx   &&
                this.yCoord < player.placeholderCoordy + (playerDimensions.height) &&
                this.yCoord + this.height > (player.placeholderCoordy)
                )
        {
            player.byFurniture = true;
            player.Furnitureby = this;
            this.changeColorWhenPlayerClose();
            TextCanvas.hasbeenRewritten = true;
            player.byFurniture = true;
            player.Furnitureby = this;
            TextCanvas.rewriteText('dragItem');

        }
        else if
        (
            (player.byFurniture && player.yCoord !== player.previousYCoord) 
            || 
            (player.byFurniture && player.xCoord !== player.previousXCoord)
        )
        {

                player.byFurniture = false;
                player.Furnitureby = null;
                player.placeholderCoordx = null;
                player.placeholderCoordy = null;
                TextCanvas.rewriteText('returnToText');
                
        }
    }
    //Purpose: put the furniture in the correct 
    drawDraggableFurniture()
    {
        if (this.isBeingDragged == true)
        {
            //draw it like 30 pixels away from the user 
            playerAreaCanvas.ctx.drawImage(this.imageElement, (userSprite.xCoord -20 ), userSprite.yCoord);
        }
        else if (this.isBeingDragged == false)
        {
            this.drawFurniture(); 
            this.isNearby(userSprite);
        }
        
    }
    //Purpose: for the sake of quest completion check if the player dragged the element far enough away 
    checkIfDraggedFurnitureFarAway()
    {
        //first apply a boolean to the moved furniture itself if it has moved far enough
        let xDifference = Math.abs(this.startingX - this.endingX);
        let yDifference = Math.abs(this.startingY - this.endingY);

        if (xDifference + yDifference > 100  && this.hasCompleted == false)
        {
            this.hasCompleted = true;
        }

        //Now check if they have done enough to complete a quest, and also check if they have already completed it
        if (chairRightDown.hasCompleted && chairRightUp.hasCompleted)
        {
            if (!statsCanvas.completedDraggingQuestCount.includes("chairQuest"))
            {
                //add one to completion
                questCompleteSoundElement.play();
                //update your progress bar
                statsCanvas.progressCounter++;
                statsCanvas.updateProgressBar();
                //they have completed the test and can move on
                TextCanvas.currentTextKey = "turnOnRadioQuest";
                // -1 not 0 to make the rewriteText work correctly
                TextCanvas.currentTextArrayIndex = -1;
                TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                //to make rewriting the text work 
                TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                button.status = "progress";
                //setTimeout(questCompleteSoundElement.play(),1000);
                TextCanvas.rewriteText();
                statsCanvas.completedDraggingQuestCount.push("chairQuest");
            }
        }
        //the else if helps with quest progression
        //check specifically if the doll has been moved
        if (doll.hasCompleted)
        {
            if (!statsCanvas.completedDraggingQuestCount.includes('dollQuest'))
            {
                //add one to completion
                questCompleteSoundElement.play();
                //update your progress bar
                statsCanvas.progressCounter++;
                statsCanvas.updateProgressBar();

                //they have completed the test and can move on
                TextCanvas.currentTextKey = "maceQuest";
                // -1 not 0 to make the rewriteText work correctly
                TextCanvas.currentTextArrayIndex = -1;
                TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                //to make rewriting the text work 
                TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];

                button.status = "progress";
                //setTimeout(questCompleteSoundElement.play(),1000);
                TextCanvas.rewriteText();
                statsCanvas.completedDraggingQuestCount.push("chairQuest");
            }

        }

            //check if youve dragged the item far enough away
            //if they have 
    }
}
class MoveableImage extends ImageClass
{
    constructor (src, xCoord, yCoord,srcX,srcY,height,width,canvasID,speed)
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
        this.byStair                   = false;
        //gives the object name you are by for interacting purposes 
        this.Furnitureby               = null;
        //Used in keeping track of the item you're dragging
        this.furnitureHolding          = null;
        //turns off collision door detection when going through
        this.usingDoor                 = null;
        //turns off NPC sprite detection
        this.insideWall                = null;
    }
    //Purpose: Move through the sprite sheet of your character to animate movement correctly
    //         Variable information: 1.animateBoolean is periodically turned off in timeouts to prevent the infinite loop animations from going wild
    //                               or when an NPC pauses
    //                               2.makeMeScared is defined for an NPC when they encounter a player
    //                               3. The frames drawn counter slows down the sprite sheet progression rate, so 15 refreshes before it goes to the next 
    //                                        
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
            //this is the default standing still, facing the player frame
            this.srcY = 10 * this.height; //tenth row is the facing down
            this.currentFrame = 0;
        }
        //used specifically for npc sprites to get them stuck in the 4th sprite row of "hurt" for the set timeout
        // you can see by looking at when this.currentPathTrack == "scared" there will be a boolean that will time this out appropriately
        //if (this.srcX = "makeMeScared")
        //{
        //    this.srcX = 4 * this.width; // pauses them as cowering down
        //}
            //image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight
            playerAreaCanvas.ctx.drawImage(this.imageElement, this.srcX, this.srcY, this.width, this.height, this.xCoord, this.yCoord, this.width, this.height);
            this.framesDrawn++;
            //Note: I left this here but this explains the actual collision detection, turn this one to see where you are actually looking for collisions
            //playerAreaCanvas.ctx.fillRect((this.xCoord + 16), (this.yCoord +10), 30, 58);
            if(this.framesDrawn >= 10)
            {
                this.currentFrame++;
                this.framesDrawn = 0;
            }
    }
    //Purpose: height and width are for sprite sheet selection and because of the nature of the canvas drawing, 
    //         the hitbox will not be accurate if you use collision detection doing the actual Xcoord, ycoord, width and height
    //         therefore we are making a function that fixes these coordinates and returns the proper ones
    // Returns: Object of hitbox dimensions
    //NOTE: this is specific to the LPC universal character sprite generator which is in the attributes for all future sprites
    getProperHitboxDimensions()
    {
        let properDimensions = 
        {
            "xCoord" : this.xCoord + 16,
            "yCoord" : this.yCoord + 10,
            "height" : 58,
            "width"  : 30
        }
        return properDimensions;
    }
    //Purpose: As the player moves, keep track of their previous location for the purpose of collision detection
    //         As in, if a collision happens, push them back to the coords before collision, and this is continously called in the requestAnimationFrame
    getPreviousXandY()
    {
        this.previousXCoord = this.xCoord;
        //you dont update when using the door because the collision detection will push you back and its hard to time that correctly
        this.previousYCoord = this.yCoord;
    }
    //Purpose: Move through paintings on a q click
    //         
    //TODO there are bugs here in the entirety of this functionality 
    moveThroughPainting()
    {
        //you can use direction to determine which way they are facing wrt the painting. There are never left or right facing paintings
        // but they can still press q if they are facing left or right because of the collision detection
        // TODO maybe prevent that dialogue firing if they are facing left or right?
        let direction = previousWalkingDirection;
        //set this, which is then changed as a timeout in a different function. this is done to turn off collision detection as your player walks through
        this.usingDoor = true;
        moveThroughPaintingSoundElement.play();
        switch (direction)
            {
                case 'up'   :
                    this.yCoord = this.yCoord - 100;
                    break;
                case 'down' :   
                    this.yCoord = this.yCoord + 120; 
                    break;
            }
    }
}
class NonPlayableCharacter extends MoveableImage
{
    constructor (src,xCoord,yCoord,srcX,srcY,height,width,canvasID,currentPathName,currentPathTrack,floor)
    {
        super (src,xCoord,yCoord,srcX,srcY,height,width,canvasID);
        this.speed = 1;
        //firstFloor,basement,secondFloor
        this.floor = floor;
        //used for spritesheet selection
        this.srcX                      = srcX;
        this.srcY                      = srcY;
        //used for proper animation
        this.animateBoolean            = false;
        this.framesDrawn               = 0;
        this.totalFrames               = 7;
        this.currentFrame              = 0;
        //used for pathing
        //there are three different paths that are randomly selected once they finish
        this.currentPathName           = null;
        //each path has individual tracks
        this.currentPathTrack          = null;
        //how many seconds they have been on the path track
        this.currentPathName           = currentPathName;
        this.currentPathTrack          = currentPathTrack;
        //used to take the NPC out of cower mode when the player moves far enough away
        this.previousTrack             = null;
        this.scaredState               = false;
        //used for collision detection    
        this.previousXCoord            = null;
        this.previousYCoord            = null;
        this.heightAndWidthAllowance   = 30;  
    }
    path()
    {
        //Purpose: Helper function in changing path directions
        //Note: not working for some reason
        function changeDirection(direction,sprite)
        {
            switch(direction)
            {
                case "up":
                    sprite.srcY = animationInformation.walkUp.spriteRow * sprite.height;
                    sprite.yCoord = sprite.yCoord - sprite.speed;
                case "down":
                    sprite.srcY = animationInformation.walkDown.spriteRow * sprite.height;
                    sprite.yCoord = sprite.yCoord + sprite.speed;
                case "right" :
                    sprite.srcY = animationInformation.walkRight.spriteRow * sprite.height;
                    sprite.xCoord = sprite.xCoord + sprite.speed;
                case "left" :
                    sprite.srcY = animationInformation.walkLeft.spriteRow * sprite.height;
                    sprite.xCoord = sprite.xCoord + sprite.speed;  
            }
        }
        //activate animation
        this.animateBoolean = true;
        // For each character (defined by their floor locations here), they will have designated paths
        // at the starting location for each, there will be a chance to switch paths 
        // Note: because of the switches and how path movement works, rn it will only work if their speed is set to 1 or lower that will still hit everything (like 0.5,0.25,etc.. for instance)
        // there will be x many paths, where each one is a walk direction and a certain amount of steps, defined by 
        //going through path one 
        switch (this.floor)
        {
            case "firstFloor":
                switch (this.currentPathName)
                {
                    case "pathOne":
                        if 
                        (
                            (this.xCoord == 322 && this.yCoord == 113)
                        )
                        {

                            this.currentPathTrack = "down";
                        }
                        else if 
                        (
                            (this.xCoord == 560 && this.yCoord == 316)||
                            (this.xCoord == 252 && this.yCoord == 197) ||
                            (this.xCoord == 497 && this.yCoord == 218) 
                        )
                        {
                            this.currentPathTrack = "up";  
                        }
                        else if 
                        (
                            (this.xCoord == 721 && this.yCoord == 316)||
                            (this.xCoord == 560 && this.yCoord == 197)
                        )
                        {
                            this.currentPathTrack = "left"
                        }
                        else if 
                        (
                            (this.xCoord == 252 && this.yCoord == 113)||
                            (this.xCoord == 322 && this.yCoord == 218) ||
                            (this.xCoord == 497 && this.yCoord == 211) 
                        )
                        {
                            this.currentPathTrack = "right"
                        }
                        //adding in pausing if shes by a kitchen appliance
                        else if 
                            ( this.xCoord == 623 && this.yCoord == 211)
                        {
                            if (Math.random() > 0.007)
                            {
                                this.currentPathTrack = "paused"
                            }
                            else
                            {
                                this.currentPathTrack = "right"
                            }
                        }
                        //see if it switches to path two or not 
                        else if (this.xCoord == 721 && this.yCoord == 211)
                        {
                            if (Math.random() > 0.5)
                            {
                                this.currentPathTrack = "down"
                            }
                            else
                            {
                                this.currentPathTrack = "down"
                                this.yCoord++;
                                this.currentPathName = "pathTwo"
                            }
                        }
                        break;
                    case "pathTwo" :
                        if 
                        (
                            (this.xCoord == 984 && this.yCoord == 253) ||
                            (this.xCoord == 691 && this.yCoord == 78) ||
                            (this.xCoord == 785  && this.yCoord == 82)

                        )
                        {

                            this.currentPathTrack = "down";
                        }
                        else if 
                        (
                            (this.xCoord == 784 && this.yCoord == 253)||
                            (this.xCoord == 720 && this.yCoord == 317)

                        )
                        {
                            this.currentPathTrack = "up";  
                        }
                        else if 
                        (
                            (this.xCoord == 784 && this.yCoord == 78) ||
                            (this.xCoord == 785 && this.yCoord == 317)
                        )
                        {
                            this.currentPathTrack = "left"
                        }
                        else if 
                        (
                            (this.xCoord == 721 && this.yCoord == 253)||
                            (this.xCoord == 691 && this.yCoord == 82) ||
                            (this.xCoord == 720  && this.yCoord == 211)

                        )
                        {
                            this.currentPathTrack = "right"
                        }
                        //adding in pausing if shes by the toiler appliance
                        else if 
                            ( this.xCoord == 784 && this.yCoord == 80 )
                        {
                            if (Math.random() > 0.007)
                            {
                                this.currentPathTrack = "paused"
                            }
                            else
                            {
                                this.currentPathTrack = "up"
                            }
                        }
                        //see if it switches to path two or not 
                        else if (this.xCoord == 721 && this.yCoord == 211)
                        {
                            if (Math.random() > 0.7)
                            {
                                this.currentPathTrack = "down"
                            }
                            else
                            {

                                this.currentPathName = "pathOne"
                                this.currentPathTrack = "down"
                                this.yCoord++;

                            }
                        }
                        break;
                }
                break;
            case "secondFloor":
                switch (this.currentPathName)
                {
                    case "pathOne":
                        if 
                        (

                            (this.xCoord == 672 && this.yCoord == 127) || //this will actually pause to have a chance to sleep
                            (this.xCoord == 749 && this.yCoord == 183) ||
                            (this.xCoord == 525 && this.yCoord == 197)
                        )
                        {

                            this.currentPathTrack = "down";
                        }
                        else if 
                        (
                            (this.xCoord == 623 && this.yCoord == 218) ||
                            (this.xCoord == 721  && this.yCoord == 309)
                        )
                        {
                            this.currentPathTrack = "up";  
                        }
                        else if 
                        (
                            (this.xCoord == 749 && this.yCoord == 309) ||
                            (this.xCoord == 721 && this.yCoord == 197)
                        )
                        {
                            this.currentPathTrack = "left"
                        }
                        else if 
                        (
                            (this.xCoord == 623 && this.yCoord == 127) ||
                            (this.xCoord == 672  && this.yCoord == 183) ||
                            (this.xCoord == 462  &&  this.yCoord == 218)
                        )
                        {
                            this.currentPathTrack = "right"
                        }
                        //see if it switches to path two or not 
                        else if (this.xCoord == 525 && this.yCoord == 218)
                        {
                            if (Math.random() > 0.99)
                            {
                                this.currentPathTrack = "right"
                            }
                            else
                            {

                                this.currentPathTrack = "left"
                                this.xCoord--;
                                this.currentPathName = "pathTwo"
                            }
                        }
                        break;
                    case "pathTwo" :
                        if 
                        (

                            (this.xCoord == 301 && this.yCoord == 120) ||
                            (this.xCoord == 147 && this.yCoord == 183 ) ||
                            (this.xCoord == 210 && this.yCoord == 246 )
           

                        )
                        {

                            this.currentPathTrack = "down";
                        }
                        else if 
                        (
                            (this.xCoord == 406 && this.yCoord == 218 ) ||
                            (this.xCoord == 462 && this.yCoord == 316 ) ||
                            (this.xCoord == 525 && this.yCoord == 274)

                        )
                        {
                            this.currentPathTrack = "up";  
                        }
                        else if 
                        (
                            (this.xCoord == 406 && this.yCoord == 120) ||
                            (this.xCoord == 301 && this.yCoord == 183)

                        )
                        {
                            this.currentPathTrack = "left"
                        }
                        else if 
                        (
                            (this.xCoord == 147 && this.yCoord == 246 ) ||
                            (this.xCoord == 210 && this.yCoord == 316 ) ||
                            (this.xCoord == 462 && this.yCoord == 274 )
           
                        )
                        {
                            this.currentPathTrack = "right"
                        }
                        //see if it switches to path two or not 
                        else if (this.xCoord == 525 && this.yCoord == 218)
                        {
                            if (Math.random() > 0.7)
                            {
                                this.currentPathTrack = "left"
                            }
                            else
                            {

                                this.currentPathName = "pathOne"
                                this.currentPathTrack = "right"
                                this.xCoord++;

                            }
                        }
                        break;
                }
                break;
            case "basement":

                break;
        }


        // when the path is pointing downwards
        if 
        ( this.currentPathTrack == "down")
        {
            this.totalFrames = 7;
            this.srcY = animationInformation.walkDown.spriteRow * this.height;
            this.yCoord = this.yCoord + this.speed;
        }
        //when the path is pointing upwards
        else if 
        (
            (this.currentPathTrack == "up")
        )
        {
            this.totalFrames = 7;
            this.srcY = animationInformation.walkUp.spriteRow * this.height;
            this.yCoord = this.yCoord - this.speed;
        }
        //when the path is pointing leftwards
        else if 
        (
            (this.currentPathTrack == "left")
        )
        {
            this.totalFrames = 7;
            this.srcY = animationInformation.walkLeft.spriteRow * this.height;
            this.xCoord = this.xCoord - this.speed;

        }
        //when the path is pointing rightwards
        else if 
        (
            ( this.currentPathTrack == "right")
        )
        {
            this.totalFrames = 7;
            this.srcY = animationInformation.walkRight.spriteRow * this.height;
            this.xCoord = this.xCoord + this.speed;
        }
        else if 
        (
            (this.currentPathTrack == "paused")
        )
        {
            this.srcY = animationInformation.walkUp.spriteRow * this.height;
            this.totalFrames = 1;
        }
        else if (this.currentPathTrack == "scared")
        {
            //want the fourth frame in the crouching/hurt animation
            this.totalFrames = 4;
            this.srcY = 20 * this.height;
            this.srcX = "makeMeScared";
        }
    }
    //Purpose: if the player gets within 80 pixels of the player, lose a heart
    detectPlayerNearby()
    {
        //collision detection when within like, 5 player widths and heights of a player
        const player = userSprite;
        if (
            this.xCoord < player.xCoord + player.width  &&
            this.xCoord + this.width > player.xCoord  &&
            this.yCoord < player.yCoord + player.height &&
            (this.yCoord + this.height) > player.yCoord
            )
        {
            if (!userSprite.insideWall)
            {
                startledDialog.xCoord = (this.xCoord + 32);
                startledDialog.yCoord = this.yCoord;
                startledDialog.drawImage()
                if (this.previousTrack == null)
                {
                    this.previousTrack = this.currentPathTrack;
                    //this is an easy way as well to only take away one heart
                    statsCanvas.health--;
                    statsCanvas.updateHearts();
                    screamSoundElement.play();
                }
                this.currentPathTrack = "scared";
                this.scaredState = true;
            }
        }
        else if
        (
            this.xCoord - 200 < player.xCoord + (player.width -player.heightAndWidthAllowance)  &&
            this.xCoord + 200 > player.xCoord + player.heightAndWidthAllowance  &&
            this.yCoord - 200< player.yCoord + (player.height) &&
            this.yCoord + 200 > (player.yCoord + player.heightAndWidthAllowance)
        )
        {
            if (!userSprite.insideWall)
            {
                warningDialog.xCoord = (this.xCoord + 32);
                warningDialog.yCoord = this.yCoord;
                warningDialog.drawImage(); 
            }
            //if false, put the warning question mark, if true restart the walking
            //because the npc is far enough away 
            if (this.scaredState)
            {
                this.scaredState = false;
                this.currentPathTrack = this.previousTrack;
                this.previousTrack = null;
            }
        }
    }
}
//TODO convert to children Player and NonPlayableCharacter
class Background extends ImageClass
{
    constructor (src, height, width, canvasID ,mapArrayObject,tileSize,floor)
    {
        super (src, height, width, canvasID )
        this.mapArrayObject  = mapArrayObject;
        this.yCoord          = 0;
        this.xCoord          = 0;
        this.tileSize        = 32;
        this.gridRows        = 15;
        this.gridCols        = 30;
        this.floor           = floor;
    }
    addmap()
    {
        playerAreaCanvas.ctx.drawImage(this.imageElement, 0, 0);
        this.addCollisionDetection();
        this.addDoorDetection();
        this.addStairDetection();
    }
    //Purpose: detects when a player runs into a wall and prevents them from moving by 
    //         resetting
    addCollisionDetection()
    {
        let array = this.mapArrayObject.collisionArray;
        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(array[arrayIndex] == 1)
                {
                    //For visualizing during debugging
                   // playerAreaCanvas.ctx.fillStyle = "red";
                    //playerAreaCanvas.ctx.fillRect(this.tileSize * eachCol, this.tileSize * eachRow,32,32)
                    let wall = new Wall(this.tileSize * eachCol, this.tileSize * eachRow);
                    wall.isCollision(wall, userSprite); 
                }
            }
        }   
    }
    //Purpose: add a black filter with opacity to the inside of walls to give a darkened effect
    // Argument: this.mapArrayObject.insidewalls
    darkenBehindTheWalls()
    {
        let array = this.mapArrayObject.insideWallArray;
        let count = 0;
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
                    let properHitboxDimensions = userSprite.getProperHitboxDimensions()
                    //when a candle is present, do collision detection and dont fill in those as brightly 
                    //also used for usersprite.insidewall boolean
                    if
                    (
                            fillerxCoord < properHitboxDimensions.xCoord + (properHitboxDimensions.width)  &&
                            fillerxCoord + this.tileSize > properHitboxDimensions.xCoord &&
                            filleryCoord < properHitboxDimensions.yCoord + (properHitboxDimensions.height) &&
                            filleryCoord + this.tileSize > (properHitboxDimensions.yCoord)
                    )
                    {

                        count ++;
                        userSprite.insideWall = true;
                        if (userSprite.hasCandle == false)
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
        if (count == 0)
        {
            userSprite.insideWall = false;
        }
    }
    // Purpose: take the locations of the doors and add collision detection plus
    //          the subsequent option to press q to move through
    addDoorDetection()
    {
        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(this.mapArrayObject.doorArray[arrayIndex] == 1)
                {
                    //create a door element
                    //for visualizing during debugging
                    //playerAreaCanvas.ctx.fillRect(this.tileSize * eachCol, this.tileSize * eachRow, 32,32)
                    let door = new Door(this.tileSize * eachCol, this.tileSize * eachRow);
                    door.isDoorCollision(door, userSprite); 
                }

            }
        }
    }
    //Purpose: take the locations of the stairs and add collision detection plus
    //         the option to press q to move to the next floor
    addStairDetection()
    {
        for (var eachRow = 0; eachRow < this.gridRows; eachRow++ )
        {
            for (var eachCol = 0; eachCol < this.gridCols; eachCol++ )
            {
                let arrayIndex = eachRow *this.gridCols  + eachCol; 
                //loops through each element in array, checks if 1 or 0
                if(this.mapArrayObject.stairArray[arrayIndex] == 1)
                {
                    let direction = "upstairs"
                    //create a door element
                    //playerAreaCanvas.ctx.fillStyle = "red";
                    //playerAreaCanvas.ctx.fillRect(this.tileSize * eachCol, this.tileSize * eachRow,32,32)
                    let stair = new Stair(this.tileSize * eachCol, this.tileSize * eachRow, direction);
                    stair.isStairCollision(stair, userSprite); 
                }
                else if (this.mapArrayObject.stairArray[arrayIndex] == 2)
                {
                    let direction = "downstairs"
                    //create a door element
                    //playerAreaCanvas.ctx.fillStyle = "red";
                    //playerAreaCanvas.ctx.fillRect(this.tileSize * eachCol, this.tileSize * eachRow,32,32)
                    let stair = new Stair(this.tileSize * eachCol, this.tileSize * eachRow, direction);
                    stair.isStairCollision(stair, userSprite); 
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
        this.height = playerAreaCanvas.tileSize;
        this.width  = playerAreaCanvas.tileSize;
    }
    isCollision(wall, player)
    {
        //Note: player x,y,width,and height are for sprite selection and not completely accurate, therefore we must
        // modify them 
        let playerDimensions = userSprite.getProperHitboxDimensions();
        if (
            wall.xCoord < playerDimensions.xCoord + playerDimensions.width  &&
            wall.xCoord + wall.width > playerDimensions.xCoord   &&
            wall.yCoord < playerDimensions.yCoord + playerDimensions.height &&
            wall.yCoord + wall.height > playerDimensions.yCoord
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
        //corresponds to the tile sizes used on every map
        this.height = playerAreaCanvas.tileSize;
        this.width  = playerAreaCanvas.tileSize;
    }
    isDoorCollision(painting, player)
    {
        //use the proper hitbox dimensions
        let playerDimensions = player.getProperHitboxDimensions();
        //When they are using the door, turn off collision detection so they can move through
        //due to the nature of requestanimation it would pop you back because you cant really just await, or at least I havent figured out how
        if (player. usingDoor == null || player.usingDoor == false)
        {
            if 
            (
                painting.xCoord < playerDimensions.xCoord + playerDimensions.width  &&
                painting.xCoord + painting.width > playerDimensions.xCoord   &&
                painting.yCoord < playerDimensions.yCoord + playerDimensions.height &&
                painting.yCoord + painting.height > playerDimensions.yCoord
            )
                {
                    if (
                            (userSprite.xCoord > 710 && userSprite.xCoord < 790 && userSprite.yCoord > 190 && userSprite.yCoord < 240)
                            || (userSprite.xcord > 20 && userSprite.xCoord <150 && userSprite.yCoord > 100 && userSprite.yCoord < 250)
                        )

                    {
                        console.log('this is a location of a weird bug that is temporarily fixed')
                    }
                    else
                    {
                        //purpose of the placeholder: to update the rewrite text correctly, you need it to be one extra step out before you rewrite
                        //since you only ever use with hitbox detection, make it the modified ones 
                        player.placeholderCoordx = playerDimensions.xCoord;
                        player.placeholderCoordy = playerDimensions.yCoord;
                        //perform hitbox collisions

                        //Note: this action is what was causing the bug on going up, now you redefine in the move through painting
                        player.xCoord = player.previousXCoord;
                        player.yCoord = player.previousYCoord;     
                        //write in the correct Text
                        //now you need to register those previous coords as options where you 
                        //can pass through and the text content changes 
                        //check that its not a repeat 
                        //doing this twice so it doesnt look weird if the user is spamming walking into it 
                        TextCanvas.hasbeenRewritten = true;
                        TextCanvas.rewriteText('byDoor');
                        //allows q to fire
                        player.byDoor = true;   

                    }
                }
            else if 
            (
                player.yCoord == player.previousYCoord && player.xCoord == player.previousXCoord &&
                painting.xCoord < player.placeholderCoordx + (playerDimensions.width)  &&
                painting.xCoord + painting.width > player.placeholderCoordx   &&
                painting.yCoord < player.placeholderCoordy + (playerDimensions.height) &&
                painting.yCoord + painting.height > (player.placeholderCoordy)
            )
                {
                    //TODO this fires in weird places
                    //Note for now Im just going to forbid it firing in the weird places bc I cant figure out the bug in time
                    if (userSprite.xCoord == 721 && userSprite.yCoord == 211)
                    (
                        console.log('this is a location of a weird bug that is temporarily fixed')
                    )
                    else
                    {
                        //Essentially what youre doing is once the collision detection pushes you back, you still give yourself the 
                        // option to use the door, as given by the boolean player.byDoor
                        //rewrite again just in case
                        TextCanvas.hasbeenRewritten = true;
                        TextCanvas.rewriteText('byDoor');
    
                        player.byDoor = true;   
                    }



                }
            //Idea here: once you move actively, you want the text options to trigger off and the option to press q to turn off
            // and to reset the placeholder for previous actions 
            //Note: based on this I think the move through has to move through then do another movement action immediately to not update you back to your initial condition which I have seen
            else if
            (
                (player.byDoor && player.yCoord !== player.previousYCoord) 
                || 
                (player.byDoor && player.xCoord !== player.previousXCoord)
            )
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
class Stair extends Wall
{
    constructor(xCoord,yCoord,type)
    {
        super(xCoord, yCoord)
        //corresponds to the tile sizes used on every map
        this.height = playerAreaCanvas.tileSize;
        this.width  = playerAreaCanvas.tileSize;
        //tells you whetehr they are going upstairs or downstairs
        this.type   = type;
    }
    isStairCollision(stair, player)
    {
        //use the proper hitbox dimensions
        let playerDimensions = player.getProperHitboxDimensions();
        if 
            (
                stair.xCoord < playerDimensions.xCoord + playerDimensions.width  &&
                stair.xCoord + stair.width > playerDimensions.xCoord   &&
                stair.yCoord < playerDimensions.yCoord + playerDimensions.height &&
                stair.yCoord + stair.height > playerDimensions.yCoord
            )
                {
                    //purpose of the placeholder: to update the rewrite text correctly, you need it to be one extra step out before you rewrite
                    //since you only ever use with hitbox detection, make it the modified ones 
                    player.placeholderCoordx = playerDimensions.xCoord;
                    player.placeholderCoordy = playerDimensions.yCoord;
                    //perform hitbox collisions
                    player.xCoord = player.previousXCoord;
                    player.yCoord = player.previousYCoord;     
                    //write in the correct Text
                    //now you need to register those previous coords as options where you 
                    //can pass through and the text content changes 
                    //check that its not a repeat 
                    TextCanvas.hasbeenRewritten = true;
                    TextCanvas.rewriteText('byStair');
                    player.byStair = true;
                    //get the correct floor it would go to 
                    if (stair.type == "upstairs")
                    {
                        if (playerAreaCanvas.floor == "firstFloor")
                        {
                            playerAreaCanvas.transitionFloor = "secondFloor"
                        }
                        else if (playerAreaCanvas.floor == "basement")
                        {
                            playerAreaCanvas.transitionFloor = "firstFloor"
                        }
                    }
                    else if (stair.type == "downstairs")
                    {
                        if (playerAreaCanvas.floor == "firstFloor")
                        {
                            playerAreaCanvas.transitionFloor = "basement"
                        }
                        else if (playerAreaCanvas.floor == "secondFloor")
                        {
                            playerAreaCanvas.transitionFloor = "firstFloor"
                        }
                    }
                }
            else if 
            (
                player.yCoord == player.previousYCoord && player.xCoord == player.previousXCoord &&
                stair.xCoord < player.placeholderCoordx + (playerDimensions.width)  &&
                stair.xCoord + stair.width > player.placeholderCoordx   &&
                stair.yCoord < player.placeholderCoordy + (playerDimensions.height) &&
                stair.yCoord + stair.height > (player.placeholderCoordy)
            )
                {
                    //Essentially what youre doing is once the collision detection pushes you back, you still give yourself the 
                    // option to use the door, as given by the boolean player.byDoor
                    //rewrite again just in case
                    TextCanvas.hasbeenRewritten = true;
                    TextCanvas.rewriteText('byStair'); 
                    player.byStair = true
                    //get the correct floor it would go to for the transitionfloor, which will be
                    //fired after transition completes
                    if (stair.type == "upstairs")
                    {
                        if (playerAreaCanvas.floor == "firstFloor")
                        {
                            playerAreaCanvas.transitionFloor = "secondFloor"
                        }
                        else if (playerAreaCanvas.floor == "basement")
                        {
                            playerAreaCanvas.transitionFloor = "firstFloor"
                        }
                    }
                    else if (stair.type == "downstairs")
                    {
                        if (playerAreaCanvas.floor == "firstFloor")
                        {
                            playerAreaCanvas.transitionFloor = "basement"
                        }
                        else if (playerAreaCanvas.floor == "secondFloor")
                        {
                            playerAreaCanvas.transitionFloor = "firstFloor"
                        }
                    }
                }
            //Idea here: once you move actively, you want the text options to trigger off and the option to press q to turn off
            // and to reset the placeholder for previous actions 
            //Note: based on this I think the move through has to move through then do another movement action immediately to not update you back to your initial condition which I have seen
            else if
            (
                (player.byStair && player.yCoord !== player.previousYCoord) 
                || 
                (player.byStair && player.xCoord !== player.previousXCoord)
            )
            {
                player.placeholderCoordx = null;
                player.placeholderCoordy = null;
                player.byStair = false;
                if (TextCanvas.hasbeenRewritten)
                {
                    TextCanvas.rewriteText('returnToText');
                    TextCanvas.hasbeenRewritten = false;
                }
                //reset floors 
                playerAreaCanvas.transitionFloor = null;
            }
    }
}



//Used in creating the canvases
const fullAreaWidth = 960;
const fullAreaHeight = 480;
const widthAddition = 352;
const heightAddition = 100;

const playerAreaCanvas = new Canvas ("playerArea", fullAreaWidth, fullAreaHeight, "firstFloor");
playerAreaCanvas.getCanvasMade();

//Add in the image of the user Sprite
const userSprite = new MoveableImage("assets/spriteSheets/playerspritesheet.png",56,7,0,0,64,64,"playerArea",7);
userSprite.createImageElement();

//Add in the images of the NPC sprites
const ladyNPCSprite = new NonPlayableCharacter("assets/spriteSheets/ladySpriteSheet.png",721,211,0,0,64,64,"playerArea","pathOne", "down", "firstFloor");
ladyNPCSprite.createImageElement();

const manNPCSprite = new NonPlayableCharacter("assets/spriteSheets/manSpriteSheet.png",525,218,0,0,64,64,"playerArea","pathOne", "down", "secondFloor"); 
manNPCSprite.createImageElement();

const childNPCSprite = new NonPlayableCharacter("assets/spriteSheets/childSpriteSheet.png",721,211,0,0,64,64,"playerArea","pathOne", "down", "basement");
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




