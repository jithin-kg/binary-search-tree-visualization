import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Drawing } from './tree/main';
import * as p5 from 'p5'
import { Tree } from './tree/tree';
import { Pts } from './tree/pts';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private canvas : p5.Renderer
  @ViewChild('canvas-placeholder') placeHolder:  ElementRef<HTMLElement> 
  // canvas: ElementRef<HTMLCanvasElement>;  
  value:number;
  private context: CanvasRenderingContext2D;
  private drawing:Drawing
  private x :number;
  private y : number;
  private tree:Tree
  ngOnInit(): void {
    // this.context = this.canvas.nativeElement.getContext('2d')!;
    // this.drawing = new Drawing(this.canvas, this.context)

    var sketch = (p: p5) => {

      p.setup = () => {
       this.canvas =  p.createCanvas(p.windowWidth, p.windowHeight);
       this.canvas.parent(this.placeHolder)
      
      };
      // p.draw = () => {
      //   p.background(51);
      //   p.fill(50);
      //   p.rect(this.x, this.y, 50, 50);
        // p.color(50)
      // };
    };
    let p5Instance = new p5(sketch);
    let pts = new Pts(
      p5Instance,
       window.innerWidth,
       window.innerHeight,
       this.canvas,
       window.innerWidth / 2,
       p5Instance.color(50)
       )
    // AppComponent.p5Instace.draw = ()=> {
    //   AppComponent.p5Instace.background(51);
    // }
    setTimeout(()=> {
      this.tree = new Tree(pts.TREEX,pts.TREEY, pts.BACKGROUNDCOLOR, pts)
    })
    
  } 

  addNewNode() {
  if(this.value != undefined){
    // this.drawing.addNewNode(this.value as number)
    if(!this.tree.search(this.value)){
      this.tree.addValueInVisual(this.value)
      console.log(`${this.value} does not exists in tree`)
    }else {
      alert(`${this.value} Already exists in tree`)

    }
  }
  }
  title = 'binaryTree';
}
