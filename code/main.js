import k from "./kaboom";
import Chance from "chance";
import spawnFood from "./src/food";
import getPlayer from "./src/player";
import showMission from "./src/ui/showMission";
import Multiplayer from "./src/multiplayer";
import PlayerModel from "./src/playerModel";
import startScene from "./src/scenes/start";
import endScene from "./src/scenes/end";
import showScoreLabel from "./src/ui/score";
import setControls from "./src/controls";
import showName from "./src/ui/name";
import spawnEnemy from "./src/enemy";
import showObstacles from "./src/obstacles";
import emitter from "./src/emitter";
import PlayerJoined from "./src/events/playerJoined";

const chance = new Chance();
let name = chance.animal();

let mp;

const JULEP_SPEED = 48;
const JULEP_HEALTH = 1000;
const OBJ_HEALTH = 4;

let insaneMode = false;

let playerModel;

k.scene("start", startScene);

k.scene("battle", () => {
  layers(["game", "ui"], "game");

  // Obstacles
  showObstacles();

  // Mission
  showMission();

  const player = getPlayer("currant", true, true);
  playerModel = new PlayerModel(name, width() / 2, height() / 2, player);
  mp = new Multiplayer(playerModel);

  showScoreLabel(playerModel.getScore());

  // spawn food
  spawnFood();

  showName(playerModel);

  (function spawner() {
    spawnEnemy(playerModel);
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
