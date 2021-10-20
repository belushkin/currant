import k from "./kaboom";
import { border_map } from "./src/map";
import spawnFood from "./src/food";
import getPlayer from "./src/player";
import { setMoveAction } from "./src/move";
import Multiplayer from "./src/multiplayer"
import PlayerModel from "./src/playerModel";

const mp = new Multiplayer()
k.scene("game", () => {
  // Draw borders
  border_map();

  // Init player
  const player = getPlayer("currant");
  const playedModel = new PlayerModel(80, 40, player);
  window.p1 = playedModel;

  // start spawning foods
  spawnFood();

  // move
//  setMoveAction(player);

  player.collides("food", (food) => {
    destroy(food);
  });

});

go("game");
