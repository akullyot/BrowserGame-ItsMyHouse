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
    if(e.key === "a")
    {
        previousWalkingDirection = "left"
        userSprite.srcY = 9 * spriteHeight;
        if (userSprite.xCoord > 0 )
        {
            userSprite.xCoord = userSprite.xCoord - spriteSpeed;
        }
    }
    else if(e.key === "d")
    {
       previousWalkingDirection = "right"
       userSprite.srcY = 11 * spriteHeight;
       if (userSprite.xCoord < (playerAreaCanvas.width - userSprite.width/1.5))
       {
            userSprite.xCoord = userSprite.xCoord + spriteSpeed;
       }
    }  
    else if (e.key == "s")
    {
        userSprite.srcY = 10 * spriteHeight;
        previousWalkingDirection = "down"
        if (userSprite.yCoord < 427)//(playerAreaCanvas.height + userSprite.height/7))
        {
            userSprite.yCoord = userSprite.yCoord + spriteSpeed;
        }
    }
    else if (e.key == "w")
    {
        previousWalkingDirection = "up"
        userSprite.srcY = 8 * spriteHeight;
        if (userSprite.yCoord > - 20)
        {
            userSprite.yCoord = userSprite.yCoord - spriteSpeed;
        }
    }
    else if (e.key == "q" )
    {
        if (userSprite.byDoor)
        {
            userSprite.srcY = 20 * spriteHeight;
            userSprite.totalFrames = 6;
            //immediately turn off by door so no more qs register
            userSprite.byDoor = false;
            //set a delay for turning off collision detection so you can travel through 
            const awaitTimeout = delay =>
                new Promise(resolve => setTimeout(resolve, delay));
            awaitTimeout(1000).then(function() 
                { 
                  userSprite.usingDoor = false;
                });
            // removes the ability to bypass collision
            userSprite.moveThroughPainting();
            TextCanvas.rewriteText('returnToText');
        }
        else
        {
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