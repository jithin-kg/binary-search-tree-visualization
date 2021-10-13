import { ElementRef } from "@angular/core";
import { Stack } from "./stack";
import { TreeNode } from "./TreeNode";


export class Drawing {
    private canvas: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D;
    private paint: boolean;
    private root:TreeNode
    private leftleaf:TreeNode
    private rightLeaf: TreeNode
    private radius = 50
    private treeRows: Array<Array<string>>= []
    private _rootX :number
    private _rootY = 59
    constructor(canvas: ElementRef<HTMLCanvasElement>, context:CanvasRenderingContext2D ){
    
        context.lineCap = "round"
        context.lineJoin = "round"
        context.strokeStyle = "black"
        context.lineWidth = 1;
        this.canvas = canvas;
        this.context = context;
        this.canvas.nativeElement.width = window.innerWidth
        this.canvas.nativeElement.height = window.innerHeight;
        this._rootX = canvas.nativeElement.width/2
        // this.initUserEvents() 
    }

    /**
     * 
     * @param value 
     * @returns returns true if insertion sucessfull
     */
     addNewNode(value:number): number {
         let treeDepth = 0;
        if(this.root == undefined){
            this.root = new TreeNode(value);
            //set root nodes x and y
            this.root.x = window.innerWidth / 2
            this.root.y = 60
            this.drawRoot(this.root.value.toString())
            return 1
        }
        const stack = new Stack<TreeNode>();
        stack.push(this.root);
        while(!stack.isEmpty() ){
            treeDepth++
            const current = stack.pop()!
            if(value > current.value){
                if(current.right != null){
                    stack.push(current.right);
                }else {
                    current.right = this.addnewTreeNode(value);
                    
                    // return 1;
                }
            }else if(value < current.value){
                if(current.left != null){
                    stack.push(current.left);
                }else {
                    current.left = this.addnewTreeNode(value);
                    // return 1;
                }
            }else {
                //value already exists in tree
                return -1;
            }
        }
        let depth = treeDepth-1
        console.log(treeDepth)
        if(this.treeRows.length < treeDepth){
            let list = new Array<string>()
            list.push(value.toString())
            this.treeRows[depth]= list
        }else {
            //already value exists in same level map
            this.treeRows[depth].push(value.toString())
        }
        // this.treeRows[depth].push(value.toString());
        console.log(this.treeRows)
        this.redrawTree()
        return 1;
    }
    drawRoot(value: string) {
        this._drawText(value, this._rootX, this._rootY);
    }
    redrawTree() {
        // for(let rowIndex =0;rowIndex < this.treeRows.length; rowIndex++ ){
        //     for(let index =0; index< this.treeRows[rowIndex].length; index++){
        //         this.drawNode(this.treeRows[index])
        //     }
        // }
        this.treeRows.forEach( (row, rowIndex) =>{
            row.forEach((node, index) =>{
                this.drawNode(node, rowIndex + 1, index)
                // https://stackoverflow.com/questions/42621345/how-to-declare-an-object-with-nested-array-of-objects-in-typescript
                // the root is row zero, so I add 1 for the normal nodes.
            //    drawNode(node, rowIndex + 1, index);
            });
        })
    }
    drawNode(value:string, row:number, position:number) {
        var stepX = 56;
        var stepY = 32;
        // subtract half from x for symmetry
        var half = (Math.pow(2, row) * stepX) / 2;
        var x = this._rootX + (stepX / 2) + (stepX * position) - half;
        var y = this._rootY + (stepY * row);
        this._drawText(value, x, y);
    }
    private _drawText(partialText: string, x: number, y: number) {
        this.context.fillText(partialText, x, y);
    }
   
    // drawNode(newNode: TreeNode) {
    //     this.context.beginPath()
    //        this.context.arc(newNode.x, newNode.y, this.radius, 0, 2 * Math.PI);
    //        this.context.stroke()

    //     //    this.context.closePath()
    //        this.context.font = "bold 13pt Calibri";
    //        this.context.textAlign = 'center';
    //        this.context.textBaseline = "middle";
    //        this.context.fillText(newNode.value.toString() , newNode.x,newNode.y)
    // }
    addnewTreeNode(value: number): TreeNode {
       return new TreeNode(value)
    }
}

enum ChildSide {
    root,
    left,
    right
}

