import * as p5 from "p5"
import { Pts } from "./pts";
import { Tree } from "./tree";

/**
 * Represent the node in binary tree
 */
export class Node {
   
    static  SIZE = 20
    static TEXTSIZE = 10 // text size of the nodes values
    static EDGETHICKNESS = 2 // nodes upper edge thickness
    //spacing between nodes
    static HORIZONTALSPACING = 15; // horizontal spacing between two nodes
    static VERTICALSPACING = 50 //vertical spacing between two nodes
    
    //tree properties
    public value:number | null
    public leftNode: Node | null
    public rightNode: Node | null
    private graphicsBufer: p5.Graphics;
    private parent:Node | null | undefined //reference to parent for helping in drawing
    private x:number = 0 // x cordinate of node 
    private y: number = 0 // y cordinate of node
    private rightSpacing:number = 0; // horizontal spacing right side
    private leftSpacing:number = 0 // horizontal spacing left side

    //total horizontal spacing
    private cumulativeRightSpacing = 0;
    private cumulativeLeftSpacing = 0;

    //appearance of the node
    private size:number;
    private color:p5.Color;
    private stroke: p5.Color;
    private textSize: number;
    private textColor: p5.Color;

    //node edge 
    private edgeColor: p5.Color;
    private edgeThickness: number;
    private pts: Pts | null

            constructor(
                {
                    graphicsBuffer,
                    parent,
                    size,
                    color,
                    stroke,
                    textSize,
                    textColor,
                    edgeColor,
                    edgeThickness,
                    pts

                }:{
                graphicsBuffer: p5.Graphics, 
                parent?:Node,
                 size?: number ,
                 color?:p5.Color ,
                stroke?:p5.Color,
                textSize?:number,
                textColor?:p5.Color,
                edgeColor?: p5.Color,
                edgeThickness?: number,
                pts?:Pts
                }
                 ){
        this.pts = pts!
        // Node.STROKE = this.pts.p5.color(0, 0, 0, 0)
        // Node.COLOR = this.pts.p5.color(255, 255, 255)
        // Node.STROKE = this.pts.p5.color(0, 0, 0)
        // Node.EDGECOLOR = this.pts.p5.color(0, 0, 0)
        // Node.VISITED = this.pts.p5.color(0, 0, 0, 0);
        // Node.SUCCESS  = this.pts.p5.color(0, 255, 0);
        // Node.FAILURE = this.pts.p5.color(255, 0, 0);    
        this.value = null
        this.leftNode = null
        this.rightNode = null
        this.graphicsBufer = graphicsBuffer;
        this.parent = parent

        this.size = size || Node.SIZE;
        this.color = color || this.pts.p5.color(255, 255, 255);
        this.stroke = stroke  || this.pts.p5.color(0, 0, 0, 0);
        this.textSize = textSize || Node.TEXTSIZE;
        this.textColor = textColor || this.pts.p5.color(0, 0, 0);
        this.edgeColor = edgeColor || this.pts.p5.color(0, 0, 0);
        this.edgeThickness = edgeThickness || Node.EDGETHICKNESS;      
        
    }

    paint(color:p5.Color){
        this.color = color;
        this.edgeColor = color;

        this.redraw()
    }
    /**
     * redraw a single node
     */
    redraw() {
        if(this.isFilled()){
            this.drawEdge()
            this.drawNode()
        }
        if(this.hashParent()){
            this.parent?.drawNode()
        }
        
    }
    /**
     * recursively search for 
     * @param value to be searched in tree
     */
    search(value: number): boolean {
       if(!this.isFilled()){
            return false;
       }
       else if(value == this.value){
           return true;
       }else if(value < this.value!){
          return this.leftNode!.search(value)!
       }else {
          return this.rightNode!.search(value)!
       }
    }
    isFilled(): boolean {
       return this.value !== null
    }

    /**
     * Recursively draw this node and all nodes below it
     */
    draw() {
        if(this.isFilled()){
            this.leftNode!.draw()
            this.rightNode!.draw()

            this.drawEdge()
            this.drawNode()
        }
    }
    /**
     * Draw the ndoe
     */
    drawNode() {
        this.graphicsBufer.fill(this.color);
        this.graphicsBufer.stroke(this.stroke);
        this.graphicsBufer.ellipse(this.x, this.y, this.size, this.size);

        this.graphicsBufer.noStroke();
        this.graphicsBufer.fill(this.textColor!);
        this.graphicsBufer.textAlign("center", "center");
        this.graphicsBufer.textSize(this.textSize);
        this.graphicsBufer.text(this.value!, this.x, this.y +1)

    }
    drawEdge() {
        if(this.hashParent()){
            this.graphicsBufer.stroke(this.pts!.p5.color(0, 0, 0))
            this.graphicsBufer.strokeWeight(this.edgeThickness)
            this.graphicsBufer.line(this.x, this.y, this.parent?.x!, this.parent?.y!)
        }
    }
    hashParent() {
        return this.parent !== null
    }

     /**
     * recursively sets the coordinates of this node and all nodes below it
     * if no cordinates are supplied the coordinates are based on the parent node's
     * locatin and spacing.
     * This function is called when a node is inserted into tree successfully
     * @param x 
     * @param y 
     */
      setCoordinates(x: number |undefined = undefined, y: number |undefined= undefined) {
        if(this.isFilled()){
            if( x === undefined && y === undefined){
                if(this.value! < this.parent!.value!){
                    //left node 
                    this.x = this.parent!.x! - this.parent!.leftSpacing
                    console.log(this.x)
                }else {
                    //right node 
                    this.x = this.parent!.x! + this.parent!.rightSpacing
                    console.log(this.x)
                }

                this.y = this.parent!.y! + Node.VERTICALSPACING
                console.log(this.y);

            }else {
                //coordinates were passed into the function
                this.x = x!;
                this.y = y!;
            }
            this.leftNode!.setCoordinates()
            this.rightNode!.setCoordinates()
        }
    }

    /**
     * reset visuals of this node and all nodes below to it to defaults
     */
    resetVisuals() {
        if(this.isFilled()){
            this.size = Node.SIZE
            this.color = this.pts!.p5.color(255, 255, 255);
            this.stroke = this.pts!.p5.color(0, 0, 0)
            this.textSize = Node.TEXTSIZE
            this.textColor = this.pts!.p5.color(0, 0, 0)

            this.edgeColor = this.pts!.p5.color(0, 0, 0)
            this.edgeThickness = Node.EDGETHICKNESS

            this.leftNode!.resetVisuals()
            this.rightNode!.resetVisuals()
        }
       
    }
    addValue(value: number): Node {
        if(!this.isFilled()){
            this.value = value;
            this.leftNode = new Node({graphicsBuffer:this.graphicsBufer, parent:this, pts:this.pts!})
            this.rightNode = new Node({graphicsBuffer:this.graphicsBufer, parent:this, pts:this.pts!})
            return this
        }else if(value < this.value!){
            //left child
            let initialLeftSpacing = this.leftNode!.cumulativeLeftSpacing + Node.HORIZONTALSPACING
            let shiftedNode = this.leftNode!.addValue(value)
            this.leftSpacing = this.leftNode!.cumulativeRightSpacing + Node.HORIZONTALSPACING
            this.cumulativeLeftSpacing = this.leftNode!.cumulativeLeftSpacing + this.leftSpacing


            //if this nodes left spacing changed then the cordinates then the coordinates 
            //of its left child also have to be updated so return left child
            if(this.leftSpacing != initialLeftSpacing){
                return this.leftNode!;
            }
            //if the left spacing of this node is not changed return the lower node that have to be adjusted
            return shiftedNode

        }else {
            let initalRightSpacing = this.rightNode!.cumulativeLeftSpacing + Node.HORIZONTALSPACING;
            let shiftedNode = this.rightNode!.addValue(value)
            this.rightSpacing = this.rightNode!.cumulativeLeftSpacing + Node.HORIZONTALSPACING
            this.cumulativeRightSpacing = this.rightNode!.cumulativeRightSpacing + this.rightSpacing

            if(this.rightSpacing != initalRightSpacing){
                return this.rightNode!;
            }
            return shiftedNode;
        }
        
    }
   
    
    
    // private STROKE: 

}