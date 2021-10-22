import k from "./../kaboom";
import PlayerModel from "./playerModel";
import big from "./big";

loadSprite("googoly", "sprites/googoly.png");
loadSprite("missile", "sprites/missile.png");

const MISSILE_SPEED = 1000;

export default function spawnEnemy(player: PlayerModel) {
  const enemy = add([
    sprite("googoly"),
    pos(rand(width() * 2), rand(height() * 2)),
    area(),
    scale(1),
    big(),
    k.origin("top"),
    "enemy",
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

  enemy.collides("food", (food) => {
    destroy(food);
    enemy.biggify(0.5);
  });

  function spawnMissile(enemy) {
    if (enemy._id !== null) {
      const angle = player.getPos().angle(enemy.pos);
      add([
        sprite("missile"),
        area(),
        pos(enemy.pos.x, enemy.pos.y),
        move(angle, MISSILE_SPEED),
        cleanup(),
        "missile",
      ]);
      wait(rand(0.5, 1.5), spawnMissile.bind(null, enemy));
    }
  }

  spawnMissile(enemy);
}
