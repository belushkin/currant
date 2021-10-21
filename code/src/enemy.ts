import k from "./../kaboom";
import PlayerModel from "./playerModel";

export default function spawnEnemy(player: PlayerModel) {
  const enemy = add([
    sprite("googoly"),
    pos(rand(width()), rand(height())),
    area(),
    k.origin("top"),
    'enemy'
  ]);

  enemy.action(() => {
    enemy.moveTo(player.getPos(), 80);
  });

  enemy.collides("bullet", (b) => {
    destroy(enemy);
    destroy(b);
    player.incScore();
    //updateScore(playerModel.getScore());
    k.addKaboom(enemy.pos);
  });
}

