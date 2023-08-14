//Area in which key events are captured and defined
//Purpose: used for getting the correct painting entry orientation
// Options: left, right, up, down
let previousWalkingDirection = null;

//Purpose: describes the spriteSheet
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
//Purpose: holds all click events
document.addEventListener("keydown", async function (e){
    userSprite.getPreviousXandY();
    userSprite.animateBoolean = true;
    let spriteHeight = userSprite.height;
    let spriteSpeed = userSprite.speed;
    if(e.key === "a" || e.key == "ArrowLeft")
    {
        //update the walking direction that exists for correct q movement through a painting
        previousWalkingDirection = "left"
        //find the correct sprite row 
        userSprite.srcY = animationInformation.walkLeft.spriteRow * spriteHeight;
        //will not let you move off the screen
        if (userSprite.xCoord > 0 )
        {
            userSprite.xCoord = userSprite.xCoord - spriteSpeed;
        }
    }
    else if(e.key === "d" || e.key == "ArrowRight")
    {
        //update the walking direction that exists for correct q movement through a painting
       previousWalkingDirection = "right"
        //get the correct sprite row
       userSprite.srcY = animationInformation.walkRight.spriteRow * spriteHeight;
       //dont allow it to leave the end of the screen (some custom wiggle room to let it slightly leave)
       if (userSprite.xCoord < (playerAreaCanvas.width - userSprite.width/1.5))
       {
            userSprite.xCoord = userSprite.xCoord + spriteSpeed;
       }
    }  
    else if (e.key == "s" || e.key == "ArrowDown")
    {
        //update the walking direction that exists for correct q movement through a painting
        userSprite.srcY = animationInformation.walkDown.spriteRow * spriteHeight;
        //get the correct sprite row
        previousWalkingDirection = "down"
        //some custom detection for the bottom
        if (userSprite.yCoord < 427)//(playerAreaCanvas.height + userSprite.height/7))
        {
            userSprite.yCoord = userSprite.yCoord + spriteSpeed;
        }
    }
    else if (e.key == "w" || e.key == "ArrowUp" )
    {
        previousWalkingDirection = "up"
        userSprite.srcY = animationInformation.walkUp.spriteRow * spriteHeight;
        if (userSprite.yCoord > - 20)
        {
            userSprite.yCoord = userSprite.yCoord - spriteSpeed;
        }
    }
    else if (e.key == "q" )
    {
        if (userSprite.byDoor)
        {
            userSprite.srcY = 14 * spriteHeight; // 14: arching animation but looks like grabbing
            userSprite.totalFrames = 7;
            //immediately turn off by door so no more q's register
            //note: not perfect by any means 
            userSprite.byDoor = false;
            // removes the ability to bypass collision after 1 sec
            userSprite.moveThroughPainting();
            TextCanvas.rewriteText('returnToText');
            //set a delay for turning off collision detection so you can travel through
            //cant just stop the animation and redraw because you would exponentially call it with the requestAnimation frame 
            const awaitTimeout = delay =>
                new Promise(resolve => setTimeout(resolve, delay));
            awaitTimeout(200).then(function() 
                { 
                  userSprite.usingDoor = false;
                });
        }
        else if (userSprite.byStair)
        {
            //Get correct user sprite location
            if (playerAreaCanvas.floor == "secondFloor" && playerAreaCanvas.transitionFloor == "firstFloor")
            {
                userSprite.xCoord = 301;
                userSprite.yCoord = 316;
            }
            else if (playerAreaCanvas.floor == "basement" && playerAreaCanvas.transitionFloor == "firstFloor")
            {
                userSprite.xCoord = 784;
                userSprite.yCoord = 316;
            }
            else if (playerAreaCanvas.floor == "firstFloor" && playerAreaCanvas.transitionFloor == "basement")
            {
                userSprite.xCoord = 784;
                userSprite.yCoord = 316;
            }
            else if (playerAreaCanvas.floor = "firstFloor" && playerAreaCanvas.transitionFloor == "secondFloor")
            {
                userSprite.xCoord = 273;
                userSprite.yCoord = 246;
            }
            playerAreaCanvas.floor = "transition"
            TextCanvas.rewriteText('returnToText');
            //TODO set all NPCs to their starting poistions
        }
        else
        {
            //puts you back in default resting position
            userSprite.animateBoolean = false;
        }

    }
    //Used for rummaging a drawer or picking up an item
    else if (e.key = "e")
    {
        
       if (userSprite.byFurniture)
       {
            if(userSprite.Furnitureby.isOpenable)
            {
                TextCanvas.rewriteText("rummageDrawers")
            }
            else if (userSprite.Furnitureby.isPickupItem)
            {
                statsCanvas.addInventoryItem(userSprite.Furnitureby)
            }
       }

    }
    else
    {
        console.log('not a valid key');
        userSprite.animateBoolean = false;
    }
});
document.addEventListener("keyup", e => 
{
    userSprite.animateBoolean = false;
})




window.onload = () =>
{
    //create the stats area
    updatePlayerArea();

    updateStatsArea();

    updateTextArea();

}
