require('./style/Raleway.css');
require('./style/MaterialIcons.css');
require('./style/Global.css');

import {GameManager} from './game/GameManager'; 

function documentLoaded() {
  var gameManager = new GameManager();
}


addEventListener('load', documentLoaded);
