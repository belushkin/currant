import k from "./kaboom";
import { border_map } from "./src/map";
import spawnFood from "./src/food";
import getPlayer from "./src/player";
import { setMoveAction } from "./src/move";
import Multiplayer from "./src/multiplayer"

const mp = new Multiplayer()
k.scene("game", () => {
  // Draw borders
  border_map();

  // Init player
  const player = getPlayer("currant");

  // start spawning foods
  spawnFood();

  // move
  setMoveAction(player);

  player.collides("food", (food) => {
    destroy(food);
  });

});

go("game");
