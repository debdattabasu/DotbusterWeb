import {Actor} from "./Actor"; 

export class AudioManager extends Actor {
  
  public mute = false; 
  public klass = "AudioManager"; 
  
 
  
  sounds = {
    'blip_high': require('../media/sounds/blip_high.ogg'),
    'blip_low': require('../media/sounds/blip_low.ogg'),
    'blip_ultra': require('../media/sounds/blip_ultra.ogg'),
    'end_game': require('../media/sounds/end_game.ogg'),
    'miss1': require('../media/sounds/miss1.ogg'),
    'miss2': require('../media/sounds/miss2.ogg'),
    'miss3': require('../media/sounds/miss3.ogg'),
    'powerup_high': require('../media/sounds/powerup_high.ogg'),
    'powerup_low': require('../media/sounds/powerup_low.ogg'),
    
  }
  
  
  public setMute(mute: boolean) {
    this.mute = mute;   
  }
  
  public playSound(name: string) {
    var audio = new Audio(this.sounds[name]); 
    if(!this.mute) audio.play(); 
    
  }
  
}