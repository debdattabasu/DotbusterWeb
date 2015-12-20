import {Actor} from "./Actor"; 
import {Global} from "./Global"; 

export class SparkActor extends Actor {
  
  public position = [0, 0]; 
  public color = [0, 1, 0, 1]; 
  
  
  private dieTime = 0.5; 
  private currentTime = 0;
  
  private sparkMaxRadius = Global.CIRCLE_RADIUS * 3; 
  private glowMaxRadius = Global.CIRCLE_RADIUS * 4; 
  private particleRadius = 6; 
  
  private sparkRadius = 0; 
  private glowRadius = 0;
  
  private sparkDirections = []; 
  
  
  constructor() {
    super(); 
    
    for(var i = 0; i < 32; i ++) {
      this.sparkDirections.push(2 * 3.14 * Math.random());
    }
  }
  
  
  public update(delta: number) {
    
    var sparkSpeed = this.sparkMaxRadius / this.dieTime; 
    var glowSpeed = this.glowMaxRadius / this.dieTime; 
    var transSpeed = 1 / this.dieTime; 
    
    this.sparkRadius = this.currentTime * sparkSpeed; 
    this.glowRadius = this.currentTime * glowSpeed;  
    this.color[3] = 1 - this.currentTime * transSpeed; 
    
    this.currentTime += delta; 
    
    if(this.currentTime > this.dieTime) this.dispose();
    

  }
  
  public draw(ctx: CanvasRenderingContext2D) {
    var color = `rgba(${Math.floor(this.color[0] * 255)}, ${Math.floor(this.color[1] * 255)}, ${Math.floor(this.color[2] * 255)}, ${this.color[3]})`; 
    var x = this.position[0]; var y = this.position[1]; 
    
    var gradient = ctx.createRadialGradient(x, y, this.glowRadius * 0.2, x, y, this.glowRadius); 
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
   
   
    ctx.beginPath();
    ctx.arc(x, y, this.glowRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = this.glowRadius; 
    ctx.shadowColor = color;
    ctx.fill();
    
    for(var i = 0; i < 32; i ++) {
			
			var myX = x + Math.cos(this.sparkDirections[i]) * this.sparkRadius;
			var myY = y + Math.sin(this.sparkDirections[i]) * this.sparkRadius;
      
      
      ctx.beginPath();
      ctx.arc(myX, myY, this.particleRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color; 
      ctx.fill();
      
			
		}
		
  }
}