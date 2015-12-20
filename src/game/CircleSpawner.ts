import {Actor} from "./Actor"; 
import {CircleActor} from "./CircleActor"; 
import {Global} from "./Global"; 
import {ScoreManager} from "./ScoreManager"; 


export class CircleSpawner extends Actor {
  
  
  private nextCircle = {
    time: 0, 
    dieTime: 10, 
    type: 'orb' 
  }
  private currentTime = 0;
  private elapsedTime = 0;
  private scoreManager: ScoreManager;
  
  
  
  private isPositionValid(pos: number[]): boolean {
    var circleRadius = Global.CIRCLE_RADIUS * 1.2;
    var myRect = [pos[0] - circleRadius, pos[1] - circleRadius, 2 * circleRadius, 2 * circleRadius];
    
    var allCircles = this.screen.getActorsByClass("CircleActor"); 
   
    
    for(var c of allCircles) {
      var circle = <CircleActor>c; 
      var rect = [circle.position[0] - circleRadius, circle.position[1] - circleRadius, 2 * circleRadius, 2 * circleRadius]; 
      
      if(Global.rectOverlap(rect, myRect)) return false;    
      
    }
    
    return true;
  }
  
  public init() {
    this.scoreManager = <ScoreManager>(this.screen.getActorByClass('ScoreManager'));
  }
  
  private getRandomPosition(): number[] {
    var numTrials  = 500;
    var padding = Global.CIRCLE_RADIUS * 1.2 + 12;
    var hudHeight = Global.HUD_HEIGHT; 
    
    for(var i = 0; i < 500; i ++) {
      var position = [padding + (Global.WIDTH - 2* padding) * Math.random(), 
      padding + hudHeight + (Global.HEIGHT - 2* padding - hudHeight) * Math.random()]; 
      
      if(this.isPositionValid(position)) return position;  
    }
    
    return null;
  }
  
  private calcNextCircleParams() {
    var interval = {
      baseline: 0.05,
      factor: 2.5
    }
    
    var dieTime = {
      baseline: 10, 
      factor: 10
    }
    
    var typePercentages = {
      virus: 0.1, 
      health: this.scoreManager.energy < 40? 0.04 : 0.02 
    }
    
    
    interval.factor -= this.elapsedTime / 45; 
    interval.factor = Math.max(interval.factor, 0.25); 
    
    dieTime.baseline -=  this.elapsedTime / 15; 
    dieTime.factor -=  this.elapsedTime / 15; 
    
    dieTime.baseline = Math.max(dieTime.baseline, 4); 
    dieTime.factor = Math.max(dieTime.factor, 4); 
    
     
    this.nextCircle.time = interval.baseline + interval.factor * Math.random(); 
    this.nextCircle.dieTime = dieTime.baseline + dieTime.factor * Math.random();
    
    var rndType = Math.random();
    if(rndType < typePercentages.virus) this.nextCircle.type = 'virus'; 
    else if(rndType < (typePercentages.virus + typePercentages.health)) this.nextCircle.type = 'health'; 
    else this.nextCircle.type = 'orb';
    
  }
  
  private addCircle() {
    var pos = this.getRandomPosition(); 
    if(pos == null) return; 
    var circle = new CircleActor(this.nextCircle.type); 
    circle.position = pos; 
    circle.dieTime = this.nextCircle.dieTime;
    this.screen.addActor(circle);
  }
  
  public update(delta: number) {
    
    if(this.currentTime > this.nextCircle.time) {
      this.addCircle(); 
      this.calcNextCircleParams(); 
      this.currentTime = 0; 
    }
    
    this.currentTime += delta;
    this.elapsedTime += delta; 
    
  }
}