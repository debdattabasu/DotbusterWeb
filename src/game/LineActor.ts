import {Actor} from "./Actor";  
import {Global} from "./Global"; 

export class LineActor extends Actor {
  
  public klass = "LineActor"; 
  public start: number[] = [];
  public end: number[] = [];
  public color = [0, 1, 0, 1];  
  
  public zIndex = 0; 
  
  private lineWidth = Global.CIRCLE_RADIUS * 0.8; 
  private glowWidth = Global.CIRCLE_RADIUS * 1.2; 
  
  public aboutToDie = false; 
  private currentTime: number = 0;
  
  private getBlinkFactor(): number {
    return 0.95 + 0.25* Math.cos(this.currentTime * 40);
  }
   
  public update(delta: number) {
    if(this.aboutToDie) {
      var blinkFactor = this.getBlinkFactor();
      this.color = [1, 0.65, 0, 1];
      this.lineWidth =  Global.CIRCLE_RADIUS * 0.9; 
      this.glowWidth = Global.CIRCLE_RADIUS * 1.2 * blinkFactor;
      
      this.currentTime += delta;
    }
  }
    
  public draw(ctx: CanvasRenderingContext2D) {
    var color = `rgba(${Math.floor(this.color[0] * 255)}, ${Math.floor(this.color[1] * 255)}, ${Math.floor(this.color[2] * 255)}, ${this.color[3]})`; 
    ctx.beginPath();
    ctx.strokeStyle = color; 
    ctx.lineWidth = this.lineWidth;
    ctx.shadowBlur = this.glowWidth;
    ctx.shadowColor = color;
    
    
    ctx.moveTo(this.start[0], this.start[1]);
    ctx.lineTo(this.end[0], this.end[1]);
    ctx.stroke();
  }
  
  
}