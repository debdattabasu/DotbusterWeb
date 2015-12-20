import {Actor} from "./Actor"; 
import {CircleActor} from "./CircleActor"; 
import {LineActor} from "./LineActor"; 
import {AudioManager} from "./AudioManager"; 
import {Global} from "./Global"; 
import {ScoreManager} from "./ScoreManager"

import {PointIndicatorActor} from "./PointIndicatorActor"

export class PathManager extends Actor {
  public dragging = false;
  
  private pointerCircle: CircleActor; 
  
  private lineList: LineActor[] = []; 
  private circleList: CircleActor[] = []; 
  
  private audioManager: AudioManager;
  private scoreManager: ScoreManager;
  
  private getCircleAtPosition(position: number[]): CircleActor {
    var radius = Global.CIRCLE_RADIUS; 
    var myRect = [position[0] - radius, position[1] - radius, 2 * radius, 2 * radius]; 
    var allCircles = this.screen.getActorsByClass("CircleActor"); 
    for(var c of allCircles) {
      var circle = <CircleActor>c; 
      if(circle.type != 'orb') continue;
      var rect = [circle.position[0] - radius, circle.position[1] - radius, 2 * radius, 2 * radius];
      if(Global.rectOverlap(rect, myRect)) return circle; 
    }
    
    return null;
  }
  
  init() {
    var container = document.getElementById('container'); 
    
    var getOffset = (e)=> {
      var target: any = e.target || e.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = e.clientX - rect.left,
      offsetY = e.clientY - rect.top;
      return [offsetX, offsetY]; 
    }
    
    container.onmousedown = (e)=> {
      var offset = getOffset(e); 
      this.start(offset[0], offset[1]);
    }; 
    container.onmouseup =  ()=> {
      this.end(); 
    };
    container.onmouseleave = ()=> {
      this.end();
    };
    
    container.onmousemove = (e)=> {
      var offset = getOffset(e); 
      this.move(offset[0], offset[1]); 
    };  
    
    
    this.audioManager = <AudioManager>(this.screen.getActorByClass('AudioManager')); 
    this.scoreManager = <ScoreManager>(this.screen.getActorByClass('ScoreManager')); 
    
  }
  
  public dispose() {
    super.dispose(); 
    var container = document.getElementById('container'); 
    container.onmousedown = null; 
    container.onmouseup = null; 
    container.onmouseleave = null; 
    container.onmousemove = null;
  }
  
  pointInPathHelper(point: number[]): boolean {
    var i = 0, j = 0;
		var res = false;
		var nvert = this.circleList.length;
		for (i = 0, j = nvert-1; i < nvert; j = i++) {
			if (((this.circleList[i].position[1] > point[1]) != (this.circleList[j].position[1] > point[1])) &&
				     (point[0] < (this.circleList[j].position[0] - this.circleList[i].position[0]) 
				    		 * (point[1] - this.circleList[i].position[1]) / (this.circleList[j].position[1]-this.circleList[i].position[1]) 
				    		 + this.circleList[i].position[0]))
				res = !res;
		}
		return res;
  }
  
  pointInPath(point: number[]): boolean {
    for(var i = 0; i < 1000; i ++) {
			var size = Global.CIRCLE_RADIUS;
			var tempX = point[0] + (Math.random() - 0.5) * size;
			var tempY = point[1] + (Math.random() - 0.5) * size;
			
			if(this.pointInPathHelper([tempX, tempY])) {
				return true;
			}
		}
		return false;
  }  
  
  concludePath() {
    
    var numOrbs = this.circleList.length;
    var numViruses = 0;
    var numHealths = 0; 
    
    var allCircles = this.screen.getActorsByClass("CircleActor"); 
    
    for(var c of allCircles) {
      var circle = <CircleActor>c; 
      if(!this.pointInPath(circle.position)) continue; 
      
      if(circle.type == 'virus') {
        numViruses ++;
            
        var point = new PointIndicatorActor('health', -10); 
        point.position = [circle.position[0], circle.position[1] - 45]; 
        this.screen.addActor(point); 
        
        circle.dispose();
      }
      
      if(circle.type == 'health') {
        numHealths ++
        var point = new PointIndicatorActor('health', 25); 
        point.position = [circle.position[0], circle.position[1] - 45]; 
        this.screen.addActor(point); 
        circle.dispose();
      }
      
    }
    
    for(var circle of this.circleList) {
      var point = new PointIndicatorActor('point', 5); 
      point.position = [circle.position[0], circle.position[1] - 45]; 
      this.screen.addActor(point); 
      circle.dispose(); 
    }
    
    for(var line of this.lineList) {
      line.dispose(); 
    }
    
    this.circleList = []; 
    this.lineList = [];
    
    
    
    var toPlay = 'blip_high'; 
    if(numOrbs > 4) toPlay = 'blip_ultra'; 
    if(numHealths != 0) toPlay = 'powerup_low'; 
    if(numViruses != 0) toPlay = 'miss3'; 
    
    this.audioManager.playSound(toPlay);
    
    this.scoreManager.setScore(this.scoreManager.score + numOrbs * numOrbs);
    var energy = this.scoreManager.energy + numHealths * 25 - numViruses * 10; 
    energy = Math.min(energy, 100); 
    this.scoreManager.setEnergy(energy); 
  }
  
  addCircle(circle: CircleActor) {
    if(circle == null) return;
    
    this.setPathEndpoint([circle.position[0], circle.position[1]]);
    
    if(this.circleList.length != 0) {
			if(this.circleList.length > 2 && this.circleList[0] == circle) {
				this.concludePath();
				return;
			}
			
			for(var i = 0; i < this.circleList.length; i++) {
				if(this.circleList[i] == circle)
					return;
			}
		}
    
		this.circleList.push(circle);
		var line = new LineActor();
    this.lineList.push(line); 
    this.screen.addActor(line); 
		line.start = [circle.position[0], circle.position[1]];
    line.end = [circle.position[0], circle.position[1]];
    
    this.audioManager.playSound('blip_low'); 
    
  }
  
  clearPath() {
    
    for(var line of this.lineList) {
      line.dispose(); 
    }
    
    this.lineList = []; 
    this.circleList = [];
    
    
  }
  
  setPathEndpoint(position: number[]) {
    var size = this.lineList.length; 
    if(size == 0) return; 
    
    
    var lastLine = this.lineList[size - 1]; 
    lastLine.end = position; 
    
    var killPath = false;
    if(size > 2) {
      for(var i = 0; i < size-1; i ++) {
        
        var line = this.lineList[i];
        if(Global.lineOverlap(line.start, line.end, lastLine.start, lastLine.end)) {
          killPath = true;
          break;
        }
      }
    }
    
    if(killPath == true){
      this.clearPath();
      this.audioManager.playSound('miss1');
      
    }
  }
  
  start(x: number, y: number) {
    if(this.pointerCircle == null) {
      this.pointerCircle = new CircleActor('pointer'); 
      this.screen.addActor(this.pointerCircle); 
    }
    this.pointerCircle.position = [x, y];


  }
  
  end() {
    if(this.pointerCircle != null) {
      this.pointerCircle.dispose(); 
      this.pointerCircle = null; 
    }
    
    this.clearPath();
  }
  
  move(x: number, y: number) {
    if(this.pointerCircle != null) {
      this.pointerCircle.position = [x, y];
      this.addCircle(this.getCircleAtPosition([x, y]));
      this.setPathEndpoint([x, y]);
    }
  }
  
  public update(delta: number) {
    	
		for(var circle of this.circleList) {
			
			if(circle.isAboutToDie()) {
				for(var line of this.lineList) {
					line.aboutToDie = true;
        }
			}
			if(circle.disposed) {
				this.clearPath();
				return;
			}
		}
  }
}