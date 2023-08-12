
class InventoryCanvas extends Canvas
{
    constructor(canvasID, width, height)
    {
        super (canvasID, width,height)
        this.ctx             = null;
        this.canvasElement   = null;
        //Boolean values that tell you whether or not a slot is filled
        this.inventoryArray  = [0,0,0,0,0,0,0,0,0]
        //once you get a food item, youre going to stack it in that inventory slot
        // note: the name and item of it is always candy 
        //this holds the index number of the food slot
        this.foodSlot        = null;
        this.foodCounter     = 0;
        //Updates your progress bar
        this.progressCounter = 0;
        //Updates your health counter 
        this.health          = 5;
    }
    //Purpose: removes hearts on hit and sends to the endgame event if you die 
    updateHearts()
    {
        switch (this.health)
        {
            case 0:
                endGame();
                break;
            case 1:
                //start warning the player they're about to die 
                //TODO warning
                heartCover.xCoord = [126,164, 199, 234 ];
                heartCover.yCoord = Array(4).fill(70) ;
                //not using the inbult draw function because im doing weird stuff with the height and width 
                for (let i =0; i< heartCover.xCoord.length; i++)
                {
                    document.getElementById("informationAndStats").getContext('2d').drawImage(heartCover.imageElement,heartCover.xCoord[i], heartCover.yCoord[i], heartCover.height, heartCover.width);
                }
                break;
            case 2:
                heartCover.xCoord = [126,164, 199];
                heartCover.yCoord = Array(3).fill(70) ;
                //not using the inbult draw function because im doing weird stuff with the height and width 
                for (let i =0; i< heartCover.xCoord.length; i++)
                {
                    document.getElementById("informationAndStats").getContext('2d').drawImage(heartCover.imageElement,heartCover.xCoord[i], heartCover.yCoord[i], heartCover.height, heartCover.width);
                }
                break;
            case 3:
                heartCover.xCoord = [126,164];
                heartCover.yCoord = Array(2).fill(70) ;
                //not using the inbult draw function because im doing weird stuff with the height and width 
                for (let i =0; i< heartCover.xCoord.length; i++)
                {
                    document.getElementById("informationAndStats").getContext('2d').drawImage(heartCover.imageElement,heartCover.xCoord[i], heartCover.yCoord[i], heartCover.height, heartCover.width);
                }

                break;
            case 4:
                heartCover.xCoord = [126];
                heartCover.yCoord = Array(1).fill(70) ;
                document.getElementById("informationAndStats").getContext('2d').drawImage(heartCover.imageElement,heartCover.xCoord, heartCover.yCoord, heartCover.height, heartCover.width);
                break;
            case 5:
                fullHeart.xCoord = [124, 159, 194, 229,264] ;
                fullHeart.yCoord = Array(5).fill(66) ;
                fullHeart.drawImage();
                break;
        }   
    }
    addInventoryItem(furniture)
    {
        //Purpose: helps canvas animation loop through where to put new inventory items
        const inventoryBoxesCoords =
        {
            "0" : [64,192],
            "1" : [160,192],
            "2" : [256, 192],
            "3" : [64,288],
            "4" : [160,288],
            "5" : [256,288],
            "6" : [64,384],
            "7" : [160,384],
            "8" : [256,384]
        }
        //Execute
        let itemArray = Object.values(furniture.itemsInside); // it is an array but filter refused to work so idk 
        if (this.foodSlot !== null)
        {
            if (itemArray.includes("candy"))
            {
                this.foodCounter++;
                this.ctx.fillStyle = "rgb(189, 177, 143)";
                this.ctx.fillRect((inventoryBoxesCoords[this.foodSlot][0] - 10), (inventoryBoxesCoords[this.foodSlot][1]- 15), 20,20)
                this.ctx.fillStyle = "black";
                this.ctx.fillText(this.foodCounter,(inventoryBoxesCoords[this.foodSlot][0] - 3), (inventoryBoxesCoords[this.foodSlot][1] - 3));
                itemArray = itemArray.filter(function(item) {
                    return item !== "candy"
                })
            }
            if (itemArray.length > 0)
            {
                for (let i = 0; i< itemArray.length; i++)
                {
                    for (let j =0; j < this.inventoryArray.length; j++)
                    {
                        if (this.inventoryArray[j] == 0)
                        {
                            let imageElementToAdd = allInventoryItems[itemArray[i]].imageElement;
                            this.ctx.drawImage(imageElementToAdd, inventoryBoxesCoords[j][0], inventoryBoxesCoords[j][1]);
                            this.inventoryArray[j] = 1;
                            break;
                        }
                    }
                }   
            }

        }
        else
        {
            for (let i = 0; i< itemArray.length; i++)
            {
                for (let j =0; j < this.inventoryArray.length; j++)
                {
                    if (this.inventoryArray[j] == 0)
                    {
                        if (itemArray[i] == "candy")
                        {
                            this.foodSlot = j;
                            this.foodCounter++
                        }
                        let imageElementToAdd = allInventoryItems[itemArray[i]].imageElement;
                        this.ctx.drawImage(imageElementToAdd, inventoryBoxesCoords[j][0], inventoryBoxesCoords[j][1]);
                        this.inventoryArray[j] = 1;
                        break;
                    }
                }
            }
        }
        //now rewrite the textArea 
        //for the sake of quest progression, this will only fire the first time you pick up a candle 
        if (itemArray.includes("candle"))
        {   
            //update your progress bar
            this.progressCounter++;
            this.updateProgressBar();

            //bookquest
            TextCanvas.currentTextKey = "bookQuest";
            // -1 not 0 to make the rewriteText work correctly
            TextCanvas.currentTextArrayIndex = -1;
            TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
            //to make rewriting the text work 
            TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];

            button.status = "progress";
            //setTimeout(questCompleteSoundElement.play(),1000);
            TextCanvas.rewriteText();

            //to stop the darkening of your character now that you have the candle
            userSprite.hasCandle = true;
        }
        else if (itemArray.includes("book"))
        {
            //play the added to inventory noise
            questCompleteSoundElement.play();
            //update your progress bar
            this.progressCounter++;
            this.updateProgressBar();

            TextCanvas.currentTextKey = "chairQuest";
            // -1 not 0 to make the rewriteText work correctly
            TextCanvas.currentTextArrayIndex = -1;
            TextCanvas.totalArrayIndex = allTexts[TextCanvas.currentTextKey].length;
            //to make rewriting the text work 
            TextCanvas.previousText = allTexts[TextCanvas.currentTextKey][0];

            button.status = "progress";
            TextCanvas.rewriteText();
            //TODO do i need a hasbook boolean?

        }
        else
        {
            TextCanvas.rewriteText("returntoText")
        }
        //now remove the items from the furniture
        furniture.itemsInside = [];
        //youre no longer interacting with a furniture item
        TextCanvas.furnitureInteractingWith = null;
    }
    // Purpose: On load and on quest completion, update the green quest progress bar
    // Logic: on case 0, draw all 6 32x32 sprites. subsequently, update the location with the half or full progress bar
    updateProgressBar()
    {
        //Purpose: holds the bar coordinates for easier redrawing
        const barCoords = 
        {
            '0' : [92,33],
            '1' : [134.1,38.5],
            '2' : [164.1,33.5],
            '3' : [194.1,33.5],
            '4' : [224.1, 33.5],
            '5' : [254.1,33.5],
        }
        //Execute
        switch(this.progressCounter)
        {
            //TODO the rest
            case 1:
                //replace the 0th index with the half bar
                halfbar.xCoord = barCoords[0][0];
                halfbar.yCoord = barCoords[0][1];
                halfbar.drawImage();
                break;
            case 2:
                //note: we have some sprite size differences because I suck at cropping. I tried to crop correctly but couldnt
                //so im doing weird jiggling of the coordinate and scaling here 
                fullbar.xCoord = barCoords[0][0]+2;
                fullbar.yCoord = barCoords[0][1] + 7;
                fullbar.drawImage();
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            case 11:
                break;
        }
    }
    //Purpose: Your hearts ran to 0, you lost! So sad :((
    endGame()
    {

    }
}



const statsCanvas = new InventoryCanvas("informationAndStats", widthAddition, fullAreaHeight);
statsCanvas.getCanvasMade();


const statsBackground = new ImageClass("assets/informationandStats/interface.png",0,0,widthAddition,fullAreaHeight,"informationAndStats");
statsBackground.createImageElement();


//add in items that are found in desks and therefore only show up in the inventory
const candle = new ImageClass ("assets/questItems/candle.png",null,null, 32,32, "informationAndStats");
candle.createImageElement();
const candy = new ImageClass("assets/questItems/candy.png", null,null,32,32, "informationAndStats")
candy.createImageElement();

//Purpose: helps with getting items out of dressers etc
const allInventoryItems =
{
    "candle" : candle,
    "candy"  : candy,
    "book"   : book
}

//add in images for progress bar, health, etc 
const halfbar = new ImageClass('assets/informationandStats/halfbar.png',null,null,32,32,"informationAndStats"); 
halfbar.createImageElement();
const fullbar = new ImageClass('assets/informationandStats/fullbar.png',null,null,32,32,"informationAndStats"); 
fullbar.createImageElement();
const fullHeart = new ImageClass('assets/informationandStats/heart.png',null,null,32,32,"informationAndStats"); 
fullHeart.createImageElement();
const heartCover = new ImageClass('assets/informationandStats/coverHeart.png',null,null,25,21,"informationAndStats"); 
heartCover.createImageElement();



function updateStatsArea()
{
    statsBackground.drawImage();
    statsCanvas.updateProgressBar();
    statsCanvas.updateHearts();
}