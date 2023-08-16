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
            stairSoundElement.play();
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
    else if (e.key == "e")
    {
       if (userSprite.Furnitureby == stereo)
       {
            //complete the quest and turn on the stereo
                //update your progress bar
                statsCanvas.progressCounter++;
                statsCanvas.updateProgressBar();
                //bookquest
                if (stereo.hasCompleted == false)
                {
                    TextCanvas.currentTextKey = "dollQuest";
                    // -1 not 0 to make the rewriteText work correctly
                    TextCanvas.currentTextArrayIndex = -1;
                    TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                    //to make rewriting the text work 
                    TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                    //reset the button
                    button.status = "progress";
                    TextCanvas.rewriteText();
                    stereo.hasCompleted = "true"
                }
                stereoSoundElement.play();
       } 
       else if (userSprite.byFurniture)
       {
            if(userSprite.Furnitureby.isOpenable)
            {
                TextCanvas.rewriteText("rummageDrawers")
            }
            else if (userSprite.Furnitureby.isPickupItem)
            {
                statsCanvas.addInventoryItem(userSprite.Furnitureby)
            }
            else if (userSprite.Furnitureby.isBreakable)
            {
                if (userSprite.hasWeapon && !userSprite.Furnitureby.isBroken)
                {
                    //make a breaking noise
                    breakingSoundElement.play();
                    userSprite.Furnitureby.isBroken = true;
                    if (userSprite.Furnitureby == mirror)
                    {
                        //move on to flickering lights
                        statsCanvas.progressCounter++;
                        statsCanvas.updateProgressBar();
                        TextCanvas.currentTextKey = "breakerBoxQuest";
                        // -1 not 0 to make the rewriteText work correctly
                        TextCanvas.currentTextArrayIndex = -1;
                        TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                        //to make rewriting the text work 
                        TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                        //reset the button
                        button.status = "progress";
                        TextCanvas.rewriteText();
                        questCompleteSoundElement.play();
                    }
                    else if (userSprite.Furnitureby == toilet)
                    {
                        //move on to spray paint
                        statsCanvas.progressCounter++;
                        statsCanvas.updateProgressBar();
                    
                        //bookquest
                        TextCanvas.currentTextKey = "sleepingQuest";
                        // -1 not 0 to make the rewriteText work correctly
                        TextCanvas.currentTextArrayIndex = -1;
                        TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                        //to make rewriting the text work 
                        TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                        //reset the button
                        button.status = "progress";
                        TextCanvas.rewriteText();
                        questCompleteSoundElement.play();
                    }
                    else if (userSprite.Furnitureby == breakerBox)
                    {
                        //move on to spray paint
                        statsCanvas.progressCounter++;
                        statsCanvas.updateProgressBar();
                        //bookquest
                        TextCanvas.currentTextKey = "whisperQuest";
                        // -1 not 0 to make the rewriteText work correctly
                        TextCanvas.currentTextArrayIndex = -1;
                        TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                        //to make rewriting the text work 
                        TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                        //reset the button
                        button.status = "progress";
                        TextCanvas.rewriteText();
                        questCompleteSoundElement.play();
                        basementBackground.inFlickerState = true;
                    }

                }
            }
       }

    }
    else if (e.key == "r" )
    {
        if (userSprite.byFurniture && userSprite.Furnitureby.isDraggable || userSprite.furnitureHolding !== null)
        {
            if (userSprite.Furnitureby == null)
            {
                if (userSprite.furnitureHolding.dragCount % 2 !== 0 )
                {
                    userSprite.furnitureHolding.endingX = userSprite.xCoord -20;
                    userSprite.furnitureHolding.endingY = userSprite.yCoord +5;
                    userSprite.furnitureHolding.xCoord = userSprite.xCoord -20;
                    userSprite.furnitureHolding.yCoord = userSprite.yCoord +5;
                    userSprite.furnitureHolding.dragCount++;
                    userSprite.furnitureHolding.isBeingDragged = false;
                    userSprite.furnitureHolding.checkIfDraggedFurnitureFarAway();
                    userSprite.furnitureHolding = null;
                }
            }
            else 
            {
                if ( userSprite.Furnitureby.dragCount == 0 )
                {
                    userSprite.Furnitureby.isBeingDragged = true;
                    userSprite.Furnitureby.startingX = userSprite.Furnitureby.xCoord;
                    userSprite.Furnitureby.startingY = userSprite.Furnitureby.yCoord;
                    userSprite.Furnitureby.dragCount++;
                    //need to pass in the furnitureby because it could theoretically change if you get close to another
                    userSprite.furnitureHolding = userSprite.Furnitureby;
                }
                //check if even or odd now, if its odd youre dropping, if its even youre picking up 
                //done this way because I only want to change the starting x at the 0th time 
                else if (userSprite.Furnitureby.dragCount % 2 == 0 )
                {
                    userSprite.Furnitureby.isBeingDragged = true;
                    userSprite.Furnitureby.dragCount++;
                    //need to pass in the furnitureby because it could theoretically change if you get close to another
                    userSprite.furnitureHolding = userSprite.Furnitureby;
                }
                else if (userSprite.Furnitureby.dragCount % 2 !== 0 )
                {
                    userSprite.furnitureHolding.endingX = userSprite.xCoord;
                    userSprite.furnitureHolding.endingY = userSprite.yCoord ;
                    userSprite.furnitureHolding.dragCount++;
                    userSprite.furnitureHolding.isBeingDragged = false;
                    userSprite.furnitureHolding = null;
                }

            }


        }
    }
    else if (e.key == "z")
    {
        //check if near the vent
        if (userSprite.Furnitureby == whisperVent)
        {
            //check if the child sprite is close (you paused it at the desired coords to make it easier for the player)
            if (childNPCSprite.xCoord == 224 && childNPCSprite.yCoord == 182)
            {
                whisperSoundElement.play();
                if (!whisperVent.hasCompleted)
                {
                    statsCanvas.progressCounter++;
                    statsCanvas.updateProgressBar();
                    TextCanvas.currentTextKey = "toiletBreakQuest";
                    // -1 not 0 to make the rewriteText work correctly
                    TextCanvas.currentTextArrayIndex = -1;
                    TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                    //to make rewriting the text work 
                    TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                    //reset the button
                    button.status = "progress";
                    TextCanvas.rewriteText();
                    whisperVent.hasCompleted = true;
                    questCompleteSoundElement.play();
                }
            }
        }
        else if (userSprite.bySleeper)
        {
            whisperSoundElement.play();
            if (!userSprite.hasCompleteSleepQuest)
            {
                statsCanvas.progressCounter++;
                statsCanvas.updateProgressBar();
                TextCanvas.currentTextKey = "sprayPaintQuest";
                // -1 not 0 to make the rewriteText work correctly
                TextCanvas.currentTextArrayIndex = -1;
                TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
                //to make rewriting the text work 
                TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];
                //reset the button
                button.status = "progress";
                TextCanvas.rewriteText();
                userSprite.hasCompleteSleepQuest = true
                questCompleteSoundElement.play();
            }
        }
        if (TextCanvas.hasbeenRewritten)
        {
            TextCanvas.rewriteText('returnToText');
            TextCanvas.hasbeenRewritten = false;
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
