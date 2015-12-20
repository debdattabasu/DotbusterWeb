import {Actor} from "./Actor"
import {Global} from "./Global"; 
import * as _ from "lodash";

export class Screen {
  
  private ctx: CanvasRenderingContext2D;
  private time; 
  
  private actors: Actor[] = [];
  
  private newActors: Actor[] = []; 
  
  public disposed = false;
   
  constructor() {
    var canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
  }
  
  run() {
    window.requestAnimationFrame(this._update.bind(this));
  }
  
  
  public addActor(actor: Actor) : Actor {
    this.newActors.push(actor); 
    actor.screen = this;
    return actor;  
  }
  
  public getActorsByClass(klass: string) : Actor[] {
    var ret: Actor[] = []; 
    for(var actor of this.actors) {
      if(actor.klass == klass) ret.push(actor); 
    }
    
    return ret;
  }
  
  public getActorByClass(klass: string) : Actor {
    for(var actor of this.actors) {
      if(actor.klass == klass) return actor; 
    }
    return null;
    
  }
  
  public dispose() {
    this.disposed = true; 
  }
  
  private _update() {
    if(!this.disposed){
      window.requestAnimationFrame(this._update.bind(this));
    } else {
      this.ctx.clearRect(0, 0, Global.WIDTH, Global.HEIGHT);
      
      for(var actor of this.actors) {
        if(!actor.disposed) this.newActors.push(actor);
      }
      
      this.actors = this.newActors; 
      this.newActors = [];
      
      for(var actor of this.actors) {
        actor.dispose(); 
      }
      
      this.actors = []
      
      return;
    }
    var now = new Date().getTime();
    var delta = now - (this.time || now);
    
    this.time = now;
    
    for(var actor of this.actors) {
      if(!actor.disposed) this.newActors.push(actor);
    }
    
    this.actors = this.newActors; 
    this.newActors = [];
    
    this.ctx.clearRect(0, 0, Global.WIDTH, Global.HEIGHT);
    
    var actors = _.sortBy(this.actors, (actor)=> actor.zIndex); 
    
    for(var actor of actors) {
      if(!actor.initialized) {
        actor.init(); 
        actor.initialized = true;
      }
      
      actor.update(delta / 1000);
      actor.draw(this.ctx); 
    }
  }
  
}