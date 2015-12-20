import {Actor} from "./Actor"; 
import {GameManager} from "./GameManager"; 
import {AudioManager} from "./AudioManager"; 

export class ScoreManager extends Actor {
  
  public klass = 'ScoreManager'; 
  
  private scoreText: HTMLElement;
  private energyIndicator: HTMLElement;
  
  public score: number = 0; 
  public energy: number = 100; 
  
  private audioManager : AudioManager;
  
  public init() {
    this.scoreText = document.getElementById('score'); 
    this.energyIndicator = document.getElementById('energy-indicator'); 
    this.audioManager = <AudioManager>(this.screen.getActorByClass('AudioManager')); 
    this.setScore(0);
    this.setEnergy(100);
    
  }
  
  public setScore(score: number) {
    this.score = score; 
    this.scoreText.innerHTML = `${score}`; 
  }
  
  public setEnergy(energy: number) {
    if(energy <= 0) {
      energy = 0; 
      this.audioManager.playSound('end_game'); 
      GameManager.instance.endGame(this.score);
    }
    this.energy = energy;
    this.energyIndicator.style.width = `${energy}%`;
  }
}