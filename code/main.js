import k from "./kaboom";
import Chance from "chance";

import spawnFood from "./src/objects/food";
import spawnCoin from "./src/objects/coin";
import spawnHeart from "./src/objects/heart";
import spawnShelters from "./src/objects/shelter";

import getPlayer from "./src/player";

import timer from "./src/ui/timer";
import showMission from "./src/ui/mission";
import getHealthbar from "./src/ui/healthbar";

import Multiplayer from "./src/multiplayer";
import PlayerModel from "./src/playerModel";
import PlayerJoined from "./src/events/playerJoined";

import startScene from "./src/scenes/start";
import endScene from "./src/scenes/end";
import showScoreLabel from "./src/ui/score";
import setControls from "./src/controls";
import showName from "./src/ui/name";
import spawnEnemy from "./src/enemy";
import showObstacles from "./src/obstacles";
import emitter from "./src/emitter";
import {WORLS_WIDTH, WORLD_HEIGHT} from "./src/constants"

loadSound("hit", "sounds/hit.mp3");
loadSound("shoot", "sounds/shoot.mp3");
loadSound("explode", "sounds/explode.mp3");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");

const chance = new Chance();
let name = chance.animal();

let mp;
let playerModel;

k.scene("start", startScene);

k.scene("battle", () => {
  layers(["game", "ui"], "game");

  // play music
  const music = play("OtherworldlyFoe");

  // Obstacles
  showObstacles(WORLS_WIDTH, WORLD_HEIGHT);

  // Mission & timer
  timer();
  showMission();

  const player = getPlayer("currant", true, false, music);
  playerModel = new PlayerModel(name, width() / 2, height() / 2, player, true);
  mp = new Multiplayer(playerModel);

  // init healthbar for the player
  const healthbar = getHealthbar(player);

  showScoreLabel(playerModel.getScore());

  // spawn food && coin && heart
//  spawnFood();
//  spawnCoin();
//  spawnHeart();
  spawnShelters();

  showName(playerModel);
/*
 // Local spawner
  (function spawner() {
    spawnEnemy(playerModel);
    // healthbar.set(rand(50, 1000));
    wait(rand(1, 3), spawner);
  })();
*/

  setControls(playerModel, WORLS_WIDTH, WORLD_HEIGHT);
  emitter.on('player.joined', (event) => {
    const player = getPlayer(event.uuid);
    const pm = new PlayerModel(event.name, event.data.posX, event.data.posY, player);
    pm.setMove(event.data.angle, event.data.speed)
    mp.addPlayer(event.uuid, pm);
  })

  emitter.on('enemy.spawn', (event) => {
    spawnEnemy(event.target, event.pos, event.uuid);
  });
  emitter.on('food.spawned', (event) => {
    spawnFood(event.pos, event.uuid);
  });

  emitter.on('coin.spawned', (event) => {
    spawnCoin(event.pos, event.uuid);
  });

  emitter.on('heart.spawned', (event) => {
    spawnHeart(event.pos, event.uuid);
  });
});

k.scene("end", () => {
  endScene(playerModel);
});

go("start");
