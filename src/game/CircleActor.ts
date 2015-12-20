import {Actor} from "./Actor"; 
import {SparkActor} from "./SparkActor"; 
import {Global} from "./Global"; 
import {ScoreManager} from "./ScoreManager"
import {PointIndicatorActor} from "./PointIndicatorActor"

export class CircleActor extends Actor {
  
  public position = [0, 0]; 
  
  /**
   * May be orb, pointer, virus, health
   */
  public type: string = "orb";
  public dieTime = 5; 
  private currentTime = 0;
  
  public zIndex = 1;
  
  public klass = "CircleActor";
  
  
  public color = [0, 1, 0, 0]; 
  
  private circleRadius = Global.CIRCLE_RADIUS; 
  private glowRadius = Global.CIRCLE_RADIUS * 1.5; 
  
  private scoreManager : ScoreManager;
  
  constructor(type: string) {
    super(); 
    this.type = type;
    
    if(type == 'pointer') {
      this.circleRadius *= 0.6;
      this.color[3] = 1;
    }
    
    if(type == 'virus') {
      this.color = [1, 0, 0, 0];
    }
    
    if(type == 'health') {
      this.color = [1, 0.45, 1, 0];
    }
    
  }
  
  public init() {
    this.scoreManager = <ScoreManager>(this.screen.getActorByClass('ScoreManager'));
  }
  
  private getBlinkFactor(): number {
    return 0.95 + 0.25* Math.cos(this.currentTime * 40);
  }
  
  private reduceEnergy() {
    this.scoreManager.setEnergy(this.scoreManager.energy - 10);
    var indicator = new PointIndicatorActor('health', -10); 
    indicator.position = [this.position[0], this.position[1] - 45]; 
    this.screen.addActor(indicator); 
    
  }
  
  public isAboutToDie(): boolean {
    var timeToDie = this.dieTime - this.currentTime; 
    return timeToDie < 3;
  }
  
  public update(delta: number) {
    if(this.type == 'pointer') return; 
    
    this.color[3] += 4 * delta; 
    this.color[3] = Math.min(this.color[3], 1);
    
    var timeToDie = this.dieTime - this.currentTime; 
    
    if(timeToDie < 3) {
      var blinkFactor = this.getBlinkFactor();
      if(this.type == 'orb') this.color = [1, 0.65, 0, 1];
      this.circleRadius =  Global.CIRCLE_RADIUS * 1.2; 
      this.glowRadius = Global.CIRCLE_RADIUS * 1.8 * blinkFactor;
    }
    
    if(timeToDie < 0) {
      if(this.type == 'orb') this.reduceEnergy(); 
      this.dispose();
    }
    
    
    this.currentTime += delta;
  }
  
  public dispose() {
    super.dispose(); 
    
    if(this.type == 'pointer') return; 
    var spark = new SparkActor(); 
    spark.position = this.position; 
    spark.color = this.color; 
    this.screen.addActor(spark);
    
  }
  
  public draw(ctx: CanvasRenderingContext2D) {
    var color = `rgba(${Math.floor(this.color[0] * 255)}, ${Math.floor(this.color[1] * 255)}, ${Math.floor(this.color[2] * 255)}, ${this.color[3]})`; 
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], this.circleRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.shadowBlur = this.glowRadius; 
    ctx.shadowColor = color;
    ctx.fill();
    
    if(this.type == 'health') {
      ctx.font = `${this.circleRadius * 1.5}px Material Icons`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillText('\uE87D', this.position[0] - this.circleRadius * 0.75, this.position[1] + this.circleRadius * 0.85);
    }
    
    if(this.type == 'virus') {
      ctx.font = `${this.circleRadius * 1.5}px Material Icons`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillText('\uE868', this.position[0] - this.circleRadius * 0.75, this.position[1] + this.circleRadius * 0.75);
    }
  }
}