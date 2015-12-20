import {Screen} from "./Screen"

export class Actor {
  public disposed = false;
  public screen : Screen;
  public klass : string = "Actor";
  public zIndex: number = 0;
  public initialized = false;
  
  public update(delta: number) {
    
  }
  
  public draw(ctx: CanvasRenderingContext2D) {
    
  }
  
  public init() {
    
  }
  
  public dispose() {
    this.disposed = true;
  }
}