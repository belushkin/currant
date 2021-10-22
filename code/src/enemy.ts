import k from "./../kaboom";
import PlayerModel from "./playerModel";
import big from "./components/big";
import insane from "./components/insane";

loadSprite("googoly", "sprites/googoly.png");
loadSprite("missile", "sprites/missile.png");

const MISSILE_SPEED = 1000;
const MISSILE_INSANE_SPEED = 1200;
const ENEMY_SPEED = 80;
const ENEMY_INSANE_SPEED = 280;

export default function spawnEnemy(player: PlayerModel) {
  const enemy = add([
    sprite("googoly"),
    pos(rand(width() * 2), rand(height() * 2)),
    area(),
    scale(1),
    big(),
    insane(),
    k.origin("top"),
    "enemy",
  ]);

  enemy.action(() => {
    enemy.moveTo(
      player.getPos(),
      enemy.isInsane() ? ENEMY_INSANE_SPEED : ENEMY_SPEED
    );
  });

  enemy.collides("bullet", (b) => {
    destroy(enemy);
    destroy(b);
    player.incScore();
    //updateScore(playerModel.getScore());
    k.addKaboom(enemy.pos);
  });

  enemy.collides("coin", (coin) => {
    destroy(coin);
    enemy.insanity(1.5);
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
        move(angle, enemy.isInsane() ? MISSILE_INSANE_SPEED : MISSILE_SPEED),
        cleanup(),
        "missile",
      ]);
      wait(rand(0.5, 1.5), spawnMissile.bind(null, enemy));
    }
  }

  spawnMissile(enemy);
}
