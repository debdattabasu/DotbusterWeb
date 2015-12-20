import {Actor} from "./Actor"; 
import {SparkActor} from "./SparkActor"; 
import {Global} from "./Global"; 
import {ScoreManager} from "./ScoreManager"

export class PointIndicatorActor extends Actor {
  
  public position = [0, 0]; 
  
  /**
   * May be point, health
   */
  public type: string = "point";
  private currentTime = 0;
  
  public zIndex = 2;
  public klass = "PointIndicatorActor";
  
  
  public color = [0.3, 0.3, 0.3, 1]; 
  private value = 0;
  
  private circleRadius = Global.CIRCLE_RADIUS * 1.36; 
  private glowRadius = Global.CIRCLE_RADIUS * 1.5; 
  
  private alphaFactor = 0.5;
  
  constructor(type: string, value: number) {
    super(); 
    this.type = type;
    this.value = value;
    
    if(type == 'health') {
      this.color = [0.5, 0.17, 0.17, 1];
      this.alphaFactor = 0.8; 
      if(this.value > 0) {
        this.color = [1, 0.45, 1, 1]; 
        this.alphaFactor = 0.5; 
      }
    }
  }
  
  
  public update(delta: number) {
   
    this.color[3] -= delta; 
    if(this.color[3] < 0) {
      this.color[3] = 0;
      this.dispose();
    }
    
    this.position[1] -= 65 * delta;
    
    this.currentTime += 0.85 * delta;
  }
  
  
  public draw(ctx: CanvasRenderingContext2D) {
    var color = `rgba(${Math.floor(this.color[0] * 255)}, ${Math.floor(this.color[1] * 255)}, ${Math.floor(this.color[2] * 255)}, 
    ${this.color[3] * this.alphaFactor})`; 
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], this.circleRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.shadowBlur = this.glowRadius; 
    ctx.shadowColor = color;
    ctx.fill();
    
    var text = `${this.value}`; 
    if(this.type == 'multiplier') text = 'X' + text; 
    if(this.type == 'health' && this.value > 0) text = '+' + text; 
    var textColor = `rgba(${Math.min(Math.floor(1.5 * this.color[0] * 255), 255)}, ${Math.min(Math.floor(1.5 * this.color[1] * 255), 255)}, 
    ${Math.min(Math.floor(1.5 * this.color[2] * 255), 255)}, ${this.color[3] * 0.8})`; 
    
    
    ctx.fillStyle = textColor;
    
    
    if(this.type == 'health') {
      ctx.font = `${this.circleRadius * 0.5}px Arial`;
      ctx.fillText(text, this.position[0] - this.circleRadius + 6, this.position[1] + 6); 
      ctx.font = `${this.circleRadius * 0.9}px Material Icons`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillText('\uE87D', this.position[0] - this.circleRadius + 32, this.position[1] + 14);
    }
    
    else {
      ctx.font = `${this.circleRadius * 0.7}px Arial`;
      ctx.fillText(text, this.position[0] - this.circleRadius * 0.2, this.position[1] + this.circleRadius * 0.25); 
    }
    
  }
}