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

const chance = new Chance();
let name = chance.animal();

let mp;
let playerModel;

k.scene("start", startScene);

k.scene("battle", () => {
  layers(["game", "ui"], "game");

  // Obstacles
  showObstacles();

  // Mission & timer
  timer();
  showMission();

  const player = getPlayer("currant", true, true);
  playerModel = new PlayerModel(name, width() / 2, height() / 2, player);
  mp = new Multiplayer(playerModel);

  // init healthbar for the player
  const healthbar = getHealthbar(player);

  showScoreLabel(playerModel.getScore());

  // spawn food && coin && heart
  spawnFood();
  spawnCoin();
  spawnHeart();
  spawnShelters();

  showName(playerModel);

  (function spawner() {
    spawnEnemy(playerModel);
    // healthbar.set(rand(50, 1000));
    wait(rand(1, 3), spawner);
  })();

  setControls(playerModel);
  emitter.on('player.joined', (event) => {
    const player = getPlayer(event.uuid);
    const pm = new PlayerModel(event.name, event.data.posX, event.data.posY, player);
    pm.setMove(event.data.angle, event.data.speed)
    mp.addPlayer(event.uuid, pm);
  })
});

k.scene("end", () => {
  endScene(playerModel);
});

go("start");
