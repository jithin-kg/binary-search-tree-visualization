import * as p5 from "p5";

export class Pts {
    public  p5: p5;
    public  CANVASWIDTH:number;
    public  CANVASHEIGHT: number;
    public  canvas : p5.Renderer
    public  TREEX:number
    public  TREEY = 100
    public BACKGROUNDCOLOR : p5.Color
    constructor(
        p5: p5, 
        canvasWidth: number,
        canvasheight: number,
        canvas: p5.Renderer,
        treeX: number,
        backgroundColor: p5.Color ){
        this.p5 = p5
        this.CANVASWIDTH = canvasWidth;
        this.CANVASHEIGHT = canvasheight;
        this.canvas =canvas;
        this.TREEX = treeX;
        this.BACKGROUNDCOLOR = backgroundColor
    }
}