//Planning out some logic
class room
{
    constructor (roomID, interiorCoords,relativeSrc)
    {
        
    }
    generateBaseLayer()
}
//Have an image class
class Image
{
    constructor () //for now
    { 
        this.xCoord        = xCoord;       //x Coord of initial location
        this.yCoord        = yCoord;       //y coord of initial location
        this.relativeSrc   = relativeSrc;
        this.height        = height;
        this.width         = width;

    }
    draw()
    {

    }

}

class MoveableChar extends Image
{
    constructor (xCoord,yCoord, speed)
    {
        super(xCoord,yCoord,relativeSrc)
    }

}

class Player extends MoveableChar
{

}

class NonPlayableCharacter extends MoveableChar
{
    constructor ()
    {

    }
    //purpose: for each floor, three different pathings will be designed that end at the same point (initial X,Y) for ease. 
    //Once that point is reached,a RNG chooses which path is executed next.
    walkCorrectPathing()
    {

    }
    detectCharacter()
    {
        
    }
}



//displaying the image
//Extend to  a Moveable Image Class
    //move function
//Extend to a Background Class
//Extend to an interactable Item Class


//Image --> 