import k from "./kaboom";
import { border_map } from "./src/map";
import spawnFood from "./src/food";
import getPlayer from "./src/player";
// import { setMoveAction } from "./src/move";
import { setMoveAction } from "./src/moveModel";

import Multiplayer from "./src/multiplayer"
import PlayerModel from "./src/playerModel";

const mp = new Multiplayer()
k.scene("game", () => {
  // Draw borders
  // border_map();
  let score = 0;
  const scoreLabel = add([
      text(score, 2),
      pos(12, 12),
      fixed(),
      z(100),
  ]);

  const playerNameHud = add([
    text(mp.name, {
      size: 24
    }),
    pos(12, height() - 36),
    fixed(),
    z(100),
  ]);

  // Init player
  const player = getPlayer("currant");
  const playedModel = new PlayerModel(80, 40, player);
  window.p1 = playedModel;

  // start spawning foods
  spawnFood();

  // move
  setMoveAction(playedModel);

  player.collides("food", (food) => {
    destroy(food);
    score += 1;
    scoreLabel.text = score;
    addKaboom(player.pos);
    player.biggify(0.5);
  });

});

go("game");
