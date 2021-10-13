import * as p5 from "p5";
import { AppComponent } from "../app.component";
import { Node } from "./node";
import { Pts } from "./pts";

export class Tree{
    
    static animationInterval = 300
    graphicsBuffer:p5.Graphics
    root: Node
    x:number;
    y:number
    backgroundColor: p5.Color
    running = false // is animation running
    timeout:any
    node:Node | null
    pts:Pts
    constructor(x:number, y:number,  backgroundColor: p5.Color, pts:Pts){
        //buffer that holds all drawing components
        this.pts = pts;
        this.graphicsBuffer =this.pts.p5.createGraphics(this.pts.CANVASWIDTH, this.pts.CANVASHEIGHT)
        
        //initialize root with null as the value inside the root node 
        this.root = new Node({graphicsBuffer: this.graphicsBuffer, pts:this.pts})
        this.x = x;
        this.y = y;
        this.backgroundColor = backgroundColor

        //properties for tracking animation
        this.timeout = null
        this.node = null // the current node being animated
        this.draw() 
    }
    /**
     * return true if value present in tree else othervise
     * @param value to be searched in tree
     */
    search(value: number) : boolean{
        return this.root.search(value)
    }
    /**
     * draws the canvas including background
     * and each node
     */
    draw(){
        this.graphicsBuffer.background(this.backgroundColor)
        if(this.root.isFilled()){
            this.root.draw()
        }
        this.updateDrawing()
    }
    /**
     * Displays the tree without redrawing every nodes in the tree
     */
    updateDrawing() {
        // setTimeout(()=> {
            this.pts.p5.image(this.graphicsBuffer, 0, 0)
        // })
        
    }

    addValueInVisual(value: number, complete = () => {}, ...callbackArgs:any[]) {
        this.node = this.root
        setTimeout(()=> {
            this.addValueFrame(value)
        },
        300)
        
    }

    startAnimation(frame:Function, ...args:any[]){
           this.node = this.root
           this.resetVisuals()
           this.continueAnimation(frame.bind(this), ...args)
    }
    continueAnimation(frame: Function, ...args: any) {
        this.timeout = setTimeout(()=> frame.bind(this)(...args),
        Tree.animationInterval
        )
    }
    resetVisuals() {
        this.draw()
    }

    addValueFrame(value: number, complete = () => {}, ...args:any[]) {
        if(this.node == null || this.node == undefined)
        return

        if(!this.node!.isFilled()){
            this.addValue(value)
            this.draw()
        }else {
            this.updateDrawing()
            if(value < this.node!.value!){
                this.node = this.node!.leftNode;
            }else if(value > this.node!.value!){
                this.node = this.node!.rightNode;
            }
            this.addValueFrame(value);
        }
    }

    stopAnimation(complete = (arg:any) => {}, ...callbackArgs:any[]) {
        this.running = false;
        this.node = null;

        clearTimeout(this.timeout);
        const args = [callbackArgs] as const
        setTimeout(() => complete(...args), Tree.animationInterval);
    }
    /**
     * add value to node and set cordinates for the subset of trees to be 
     * adjusted
     * @param value 
     */
    addValue(value: number) {
      const shiftedNode:Node =  this.root.addValue(value)
      this.setCoordinates(shiftedNode)
    }
    /**
     * if the shifted node is root node ,then place it at x & y positions
     * else sets its cordinates based on its parent coordinates
     * @param shiftedNode newly added node
     */
    setCoordinates(shiftedNode: Node) {
        if(shiftedNode == this.root){
            shiftedNode.setCoordinates(this.x, this.y)
        }else {
            shiftedNode.setCoordinates()
        }
    }
}