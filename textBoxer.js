//writing text onto the canvas
const allTexts = 
{
    'starting'            : ["I've been living in these walls for months now. I want my house back.", "If I convince the current residents that this house is haunted ..", "I'll finally have my house back.", "But... How do I do it? ", "Behind the paintings are holes I made to move in and out of the walls.", "I just can't let them know I'm here.", "There's a book of paranormal encounters I found on the other side of the wall.", "I should go there and find it.", "First, it's pretty dark. I should try to steal a candle..."],
    'bookQuest'           : ["Quest 1 complete!", "Great. Now I can see.", "I should enter in the wall south of the dining table and find that book."],
    'chairQuest'          : ["Quest 2 complete!","Lets look through this book...", "The progress bar in my inventory shows how far I've gotten in the book","I have 10 more quests to complete.",  "Im sure if I complete this book the family will finally leave.", "*starts reading*", "Chapter 1: Poltergeists", "So... poltergeists unexplainably move items.", "I should try with some chairs."],
    'turnOnRadioQuest'    : ["Quest 3 complete!", "Chapter 1 also says that poltergeists can manipulate electricity.", "If I turn on the radio upstairs without them catching me", "I'm sure that will scare them."],
    'whisperQuest'        : ["Quest 4 complete!", "Chapter 2: General Ghosts..", "According to this, ghosts sometimes try to communicate with the living", "I should whisper from behind the painting when someone walks by."],
    'breakerBoxQuest'     : ["Quest 5 complete!", "Next, "],
    'scaryNoteQuest'      : ["Quest 6 complete!"],
    'sleepingQuest'       : ["Quest 7 complete!"],
    'breakDressersQuest'  : ["Quest 8 complete!"],
    'dollQuest'           : ["Quest 9 complete!"],
    'flickerLightsQuest'  : ["Quest 10 complete!"],
    'sigilQuest'          : ["Quest 11 complete!", "Chapter x: the Occult", "Lets get some spray paint and make a summoning circle"]
}
const allHints = 
{
    'starting'            : "I bet one of these dressers has a candle in it...",
    'bookQuest'           : "the inside of the wall with the brick showing is interactable and the book is there.",
    'chairQuest'          : " I should try dragging two of the chairs directly above me at least 3 tiles away.",
    'whisperQuest'        : "",
    'breakerBoxQuest'     : "",
    'scaryNoteQuest'      : "",
    'sleepingQuest'       : "",
    'breakDressersQuest'  : "",
    'dollQuest'           : "",
    'flickerLightsQuest'  : "",
    'sigilQuest'          : ""
}
const allPlayerOptions =
{
    'byDoor'                : "Press q to move through the painting",
    'byStair'              : 'Press q to go to the other floor',
    'openingFurniture'      : "Press e to rummage through furniture",
    'pickingUpItem'         : "Press e to pickup item"
}
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
        else if (tempDirection = "returnToText")
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