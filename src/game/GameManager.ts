import {Screen} from "./Screen"; 
import {CircleSpawner} from "./CircleSpawner"; 
import {PathManager} from "./PathManager"; 
import {AudioManager} from "./AudioManager"; 
import {ScoreManager} from "./ScoreManager"; 

export class GameManager {
  static instance : GameManager; 
  screen: Screen;
  
  hud: HTMLElement; 
  instructions: HTMLElement; 
  instuctionsHeader: HTMLElement; 
  
  private backgroundMusic = new Audio(require('../media/sounds/music_ambient.ogg')); 
  
  private mute = false;
  
  endGame(score: number) {
    if(this.screen != null) {
      this.screen.dispose(); 
      this.screen = null;
     
    }
    
    this.hud.style.display = 'none'; 
    this.instructions.style.display = 'block'; 
    this.instuctionsHeader.innerHTML = `Score: ${score}`;
  }
  
  constructor() {
    GameManager.instance = this; 
    
    this.hud = document.getElementById('hud'); 
    this.instructions = document.getElementById('instructions'); 
    this.instuctionsHeader = document.getElementById('instructions-header'); 
    
    this.hud.style.display = 'none'; 
    
    this.backgroundMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    
    this.backgroundMusic.play(); 
    
    var muteButton = document.getElementById('mute-button'); 
    
    muteButton.onclick = () => {
      var mute = !this.mute; 
      var txt = mute? '\uE04F' : '\uE050'; 
      muteButton.innerHTML = txt; 
      this.mute = mute; 
      this.setMute(mute); 
    }
    var startButton = document.getElementById('game-start'); 
    
    startButton.onclick = ()=> this.newGame();   
    
    
  }
  
  setMute(mute: boolean) {
    this.backgroundMusic.muted = mute; 
    if(this.screen != null) {
      var audioManager = <AudioManager>(this.screen.getActorByClass('AudioManager')); 
      audioManager.setMute(mute);
    }
  }
  
  newGame() {
    this.instructions.style.display = 'none'; 
    this.hud.style.display = 'flex'; 
    var screen = new Screen(); 
    screen.addActor(new AudioManager());
    screen.addActor(new CircleSpawner()); 
    screen.addActor(new PathManager()); 
    screen.addActor(new ScoreManager()); 
    
    screen.run();
    
    this.screen = screen;
  }
}