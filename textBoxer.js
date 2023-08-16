//Purpose: an object of arrays, where key.array[0] contains all the text options and helps display the correct text
const allTexts = 
{
    'starting'            : ["I've been living in these walls for months now. I want my house back.", "If I convince the current residents that this house is haunted ..", "I'll finally have my house back.", "But... How do I do it? ", "Behind the paintings are holes I made to move in and out of the walls.", "I just can't let them know I'm here.", "First, it's pretty dark. I should try to steal a candle..."],
    'bookQuest'           : ["Quest 1 complete!", "Great. Now I can see.", "There's a book of paranormal encounters I found on the other side of the wall.", "I should enter in the wall south of the dining table and find that book."],
    'chairQuest'          : ["Quest 2 complete!","Lets look through this book...", "The progress bar in my inventory shows how far I've gotten in the book","I have 10 more quests to complete.",  "Im sure if I complete this book the family will finally leave.", "*starts reading*", "Chapter 1: Poltergeists", "So... poltergeists unexplainably move items.", "I should try with some chairs."],
    'turnOnRadioQuest'    : ["Quest 3 complete!", "Chapter 1 also says that poltergeists can manipulate electricity.", "If I turn on the radio upstairs without them catching me", "I'm sure that will scare them."],
    'dollQuest'           : ["Quest 4 complete!", "Chapter 1 also says that poltergeists sometimes possess items", "Nothing is scarier than a possessed doll", "I should move the doll upstairs at least three tile blocks"],
    'maceQuest'           : ["Quest 5 complete!", "Poltergeists are also extrememly violent and known to smash items", "I should find an object with which I can smash things.", "Maybe upstairs they have some sort of self defense object."],
    'smashMirrorQuest'    : ["Quest 6 complete!", "Poltergeists also apparently are very adverse to mirrors", "I should use the mace I just picked up to smash the mirror in the bedroom"],
    'breakerBoxQuest'     : ["Quest 7 complete!", "Chapter 2: Ghosts", "Ghosts are also able to manipulate electricity,", "Especially the lights.","I should go downstairs and turn off the breaker box,","causing the lights to flicker."],
    'whisperQuest'        : ["Quest 8 complete!", "According to Chapter 2, ghosts sometimes try to communicate with the living", "I should whisper from behind the vent in the basement wall,", "when someone walks by."],
    'toiletBreakQuest'    : ["Quest 9 complete!", "According to Chapter 2, ghosts can also be violent", "I should go to the main floor and break the toilet"],
    'sleepingQuest'       : ["Quest 10 complete!", "According to chapter 2, ghosts will interact", "with people while sleeping", "Im sure I could sneak to the man upstairs and scare him while sleeping." ],
    'sprayPaintQuest'     : ["Quest 11 complete!", "Chapter 3: The History of Ghosts", "According to this chapter, ghosts tend to manifest", "In areas where the occult has occured", "I should find some paint and draw an occult sigil"],
    'sigilQuest'          : ["After countless scares, you perform the coup de grâce and draw an occult symbol on the floor", "The homeowners find it, are terrified, and pack their bags immediately.", "Congratulations, the house is yours again!", "That is, until the next family moves in...."],
    'lost'                : ["Finally, the family caught on and the police were called.", "Not just have you lost your house, but you have lost your freedom."]
}
//Purpose: for the sake of linear quest progression, keep track of if a quest has been completed. If you do it out of order, youll just have to redo the quest, if applicable. 
//         If not, use the second boolean to then see if you have already done it. If it doesnt apply, the value will be null.
//TODO this hasnt been implemented at all yet
const completionTracker =
{
    'starting'            : [false,false],
    'bookQuest'           : [false,false],
    'chairQuest'          : [false,null],
    'turnOnRadioQuest'    : [false,null],
    'dollQuest'           : [false,null],
    'maceQuest'           : [false,false],
    'smashMirrorQuest'    : [false,false],
    'breakerBoxQuest'     : [false,null],
    'whisperQuest'        : [false,null],
    'toiletBreakQuest'    : [false,false],
    'sleepingQuest'       : [false,null],
    'sprayPaintQuest'     : [false,false], 
    'sigilQuest'          : [false,null]
}
// Purpose: for each quest, after completing the dialogue above, a basic hint is added telling the player exactly what to do, if they click on the hint button.
const allHints = 
{
    'starting'            : "I bet one of these dressers has a candle in it...",
    'bookQuest'           : "The inside of the wall with the brick showing is interactable and the book is there.",
    'chairQuest'          : "I should try dragging two of the chairs directly above me at least 3 tiles away.",
    'turnOnRadioQuest'    : "There is a stereo upstairs I can turn on.",
    'dollQuest'           : "Move the doll upstairs at least three tiles away.",
    'maceQuest'           : "Search upstairs drawers for a blunt weapon.",
    'smashMirrorQuest'    : "Smash the mirror in the upstairs bathroom with a mace.",
    'breakerBoxQuest'     : "Interact with the grey box in the basement.",
    'whisperQuest'        : "While the child in the basement is standing by the vent, whisper.",
    'toiletBreakQuest'    : "Break the toilet on the first floor.",
    'sleepingQuest'       : "While the man is sleeping upstairs, tickle his toes. Run out of the room fast!",
    'sprayPaintQuest'     : "Search downstairs for spray paint.", 
    'sigilQuest'          : "Congratulations on winning! Please return to the entrance page to see art and sound attributions.",
    'lost'                : "Return to the main menu to try again."
}
//Purpose: When near an interactable item, the text will change to one of these following options. Then, when they move out of range the rewriteText option
//         will fire and bring them back to the quest dialogue.
const allPlayerOptions =
{
    'byDoor'                : "Press q to move through the painting",
    'byStair'               : 'Press q to go to the other floor',
    'openingFurniture'      : "Press e to rummage through furniture",
    'pickingUpItem'         : "Press e to pickup item",
    'dragItem'              : "Press r to drag item, then r to drop item",
    'stereo'                : "Press e to start the stereo",
    'breakerBox'            : "Press e to flicker the lights",
    'breakingItem'          : "Press e to smash the object",
    'noWeapon'              : "I need a weapon before I can smash this object.",
    'whisper'               : "Press z to whisper",
    'bySleeper'             : "Press z to scare the sleeper"
}
//Purpose            : extends the Canvas class to include clickable areas and buttons. This also holds all the text rewriting functionality.
// All instantiations: TextCanvas
class ClickableCanvas extends Canvas
{
    constructor(canvasID, width,height)
    {
        super(canvasID,width,height)
        this.previousText             = null;
        this.ctx                      = null;
        this.canvasElement            = null;
        this.currentTextKey           = "starting";
        this.currentTextArrayIndex    = 0;
        this.totalArrayIndex          = allTexts[this.currentTextKey].length;
        this.currentText              = null;
        this.hasbeenRewritten         = null;
        //for rewriting purposes
        this.counter                  = 0; 
        //for keeping track of what furniture you clicked 
        this.furnitureInteractingWith = null;

    }
    addClickability()
    {
        //needs to be called after getCanvasMade
        if (this.canvasElement === null)
        {
            console.warn('you must first call this.getCanvasMade()!')
        }
        else
        {   
            this.canvasElement.addEventListener('click', function(event){
                if (button.status !== "addtoInventory")
                {
                    let rect = TextCanvas.canvasElement.getBoundingClientRect();
                    let x = event.clientX - rect.left;
                    let y = event.clientY - rect.top;
                    if( x < (button.xCoord + button.width) && x > (button.xCoord) && y < (button.yCoord + button.height) && y > (button.yCoord))
                    {
                        if(!button.beenClickedYet)
                        {
                            backgroundMusicElement.play();
                            button.beenClickedYet = true;
                        }

                            TextCanvas.rewriteText(null);
                    }
                }
                else if (button.status == "addtoInventory")
                {
                   button.buttonclick();  
                   //note: this right now is the canvas element, not the canvas object
                   var furniture = TextCanvas.furnitureInteractingWith; 
                   statsCanvas.addInventoryItem(furniture);               
                }
                //eventually will add in more
            })
        }
    }
    //Purpose: when mousing over the clickable next or info button, change the cursor style
    addMouseoverChange()
    {
        //TODO when there is no button, turn off the event listener
        //element.removeEvent listener when button not present
        let canvas = this.canvasElement;
        canvas.addEventListener('mousemove', function (event){
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if( x < (button.xCoord + button.width) && x > (button.xCoord) && y < (button.yCoord + button.height) && y > (button.yCoord))
            {
                if (button.status == "progress" || button.status == "addtoInventory")
                {
                    canvas.style.cursor = "pointer";
                }
                else if (button.status == "hint")
                {
                    canvas.style.cursor  = "help";
                }
            }
            else
            {   
                    canvas.style.cursor = "auto";
            }
        });
        
    } 
    rewriteText(tempDirection)
    {
        //Purpose: A helper function because you repeat the text a lot
        //TODO implement this
        if (tempDirection == null)
        {
            let key = this.currentTextKey;
            let currentIndex = this.currentTextArrayIndex;
            let totalArrayIndex = this.totalArrayIndex;
            //drawing a hint as the final
            if ( currentIndex == totalArrayIndex -1) 
            {
                button.status = "hint";
                button.buttonclick();
                this.ctx.clearRect(0,0,this.width,this.height);
                this.currentTextArrayIndex++;
                textBackground.drawImage();
                this.generateText();
            }
            else
            {
                //occurs during a quest progression
                if (currentIndex !== -1)
                {
                    button.buttonclick();
                }
                this.currentText = allTexts[key][currentIndex + 1];
                this.currentTextArrayIndex++;
                this.ctx.clearRect(0,0,this.width,this.height);
                textBackground.drawImage();
                this.generateText();
                if (currentIndex == totalArrayIndex - 2)
                {
                    button.status = "hint"
                    button.drawQuestionImage();
                }
                else
                {
                    button.drawImage();
                    button.status = "progress";
                }

            }
            //progress in the storyline
        }
        else if (tempDirection == "byDoor")
        {
            //first keep track of previous text 
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            //dont draw a button
            this.currentText = allPlayerOptions.byDoor;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if(tempDirection == "breakerBox")
        {
            //first keep track of previous text 
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            //dont draw a button
            this.currentText = allPlayerOptions.breakerBox;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if(tempDirection == "byStair")
        {
            //first keep track of previous text 
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            //dont draw a button
            this.currentText = allPlayerOptions.byStair;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "dragItem")
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.dragItem;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "pickingUpItem")
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.pickingUpItem;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "openingFurniture")
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.openingFurniture;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "rummageDrawers")
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            //clear the text canvas first
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            let furniture = userSprite.Furnitureby;
            if (furniture.itemsInside.length >= 1 )
            {
                this.currentText = "After searching, you find the following:"
                this.furnitureInteractingWith = furniture;
                this.addtoInventoryOptions(furniture);
            }
            else
            {
                this.currentText = "You search but find nothing useful inside"
            }

            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 55);
            this.counter++;
        }
        else if (tempDirection == "stereo" )
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.stereo;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "whisper" )
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.whisper;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "bySleeper")
        {
            //first keep track of previous text 
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            //dont draw a button
            this.currentText = allPlayerOptions.bySleeper;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;
        }
        else if (tempDirection == "breakingItem")
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.breakingItem;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;

        }
        else if(tempDirection == "noWeapon")
        {
            if (this.counter == 0)
            {
                this.previousText = this.currentText; 
            }
            this.currentText = allPlayerOptions.noWeapon;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            this.counter++;

        }
        else if (tempDirection == "returnToText")
        {
            //check button status to return the correct button
            this.counter = 0;
            this.currentText = this.previousText;
            this.ctx.clearRect(0,0,this.width,this.height);
            textBackground.drawImage();
            this.generateText();
            if (this.currentTextArrayIndex < this.totalArrayIndex)
            {
                button.drawImage();
                button.status = "progress";
            }
            else if (this.currentTextArrayIndex !== this.totalArrayIndex)
            {
                button.status = "hint"
                button.drawQuestionImage();
            }
        }
    }
    generateText()
    {
        if (this.currentText == null)
        {
            this.currentText = allTexts[this.currentTextKey][this.currentTextArrayIndex];
        }
        this.ctx.font = "bold 20px Courier New";
        if (this.totalArrayIndex <= (this.currentTextArrayIndex))
        {
            this.ctx.fillStyle = "green";
            this.ctx.fillText(allHints[this.currentTextKey], 65, 90);    
            return;
        }
        else
        {
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.currentText, 65, 90);
            return;
        }

    }
    addtoInventoryOptions(furniture)
    {
        //x area to work with: from 65 to 1200
        //you will never have more than 3 options
        const startingAreas = [65, 465, 865]
        for (let i =0; i < furniture.itemsInside.length; i++)
        {
            this.ctx.font = "bold 20px Courier New";
            this.ctx.fillStyle = "brown";
            this.ctx.fillText(furniture.itemsInside[i], startingAreas[i], 105);
            //add a button immediately after
            button.status = "addtoInventory";
            button.drawInventoryImage();
            //TODO add items to inventory on click 
        } 
    }
}


class ButtonClass extends ImageClass
{
    constructor (src, xCoord, yCoord, height, width, canvasID, status)
    {
        super (src, xCoord, yCoord, height, width, canvasID,)
        this.beenClickedYet   = false;
        //three options are hint, progress, and addtoInventory
        this.status           = status
        this.questionSrc      = "assets/textArea/question.png";
        this.inventorySrc     = "assets/textArea/inventorybutton.png"
        this.questionElement  = null;
        this.inventoryElement = null;
    }
    switchActiveState()
    {
        if (this.status == "progress")
        {
            this.status == "hint"
        }
        else if (this.status == "hint")
        {
            this.status == "progress"
        }
    }
    //Purpose: play a fun noise!
    buttonclick()
    {
        if (this.status == "progress")
        {
            textWritingSoundElement.play();
        }
        else if (this.status == "hint")
        {
            hintSoundElement.play();
        }
        else if (this.status = "addtoInventory")
        {
            addtoInventorySoundElement.play();
        }
    }
    //todo these could be conglomerated
    createQuestionElement()
    {
        let image = new Image();
        image.src = this.questionSrc;
        this.questionElement = image;   
    }
    createInventoryElement()
    {
        let image = new Image();
        image.src = this.inventorySrc;
        this.inventoryElement = image;
    }
    drawQuestionImage()
    {
        if (this.questionElement === null)
        {
            console.warn('you are trying to work with an image element you have not created. run classInstanceName.createImageElement() and/or check your promise All.')
        }
        else
        {
            document.getElementById(this.canvasID).getContext('2d').drawImage(this.questionElement,this.xCoord, this.yCoord);

        }
    }
    drawInventoryImage()
    {
        if (this.inventoryElement === null)
        {
            console.warn('you are trying to work with an image element you have not created. run classInstanceName.createImageElement() and/or check your promise All.')
        }
        else
        {
            document.getElementById(this.canvasID).getContext('2d').drawImage(this.inventoryElement,this.xCoord, this.yCoord);

        }
    }
}

const TextCanvas = new ClickableCanvas("textArea", fullAreaWidth + 352, 160);
TextCanvas.getCanvasMade();


const textBackground = new ImageClass("assets/textArea/textInterface.png",0,0,widthAddition,fullAreaHeight,"textArea");
textBackground.createImageElement();

const button = new ButtonClass("assets/textArea/nextbutton.png",1200,65, 32,32,"textArea", "progress");
button.createImageElement();
button.createQuestionElement();
button.createInventoryElement();





function updateTextArea()
{
    textBackground.drawImage();
    TextCanvas.generateText(this.currentText)
    button.drawImage();
    TextCanvas.addClickability();
    TextCanvas.addMouseoverChange();
}