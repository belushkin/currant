import k from "./kaboom";
import { border_map } from "./src/map";
import spawnFood from "./src/food";
import getPlayer from "./src/player";
import { setMoveAction } from "./src/move";

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

  // action(() => {
  //   camPos(vec2(0, 100));
  // });
});

go("game");
