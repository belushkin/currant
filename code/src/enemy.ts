import k from "./../kaboom";
import PlayerModel from "./playerModel";
import big from "./components/big";
import {Vec2} from "kaboom";
import insane from "./components/insane";

const objs = [
	{
    sprite: "googoly",
    health: 3
  },
  {
    sprite: "gigagantrum",
    health: 6
  },
  {
    sprite: "mark",
    health: 1
  },
  {
    sprite: "onion",
    health: 4
  },
  {
    sprite: "goldfly",
    health: 5
  },
  {
    sprite: "bag",
    health: 2
  }
];

for (const obj of objs) {
	loadSprite(obj.sprite, `sprites/${obj.sprite}.png`);
}
loadSprite("missile", "sprites/missile.png");

const MISSILE_SPEED = 1000;
const MISSILE_INSANE_SPEED = 1200;
const ENEMY_SPEED = 80;
const ENEMY_INSANE_SPEED = 280;

const ENEMY_HEALTH = 10;

export default function spawnEnemy(player: PlayerModel, pos: Vec2) {
  const enemyObj = choose(objs);
  const enemy = add([
    k.pos(pos),
    sprite(enemyObj.sprite),
    area(),
    scale(1),
    health(enemyObj.health),
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

  enemy.on("death", () => {
		k.addKaboom(enemy.pos);
    destroy(enemy);
    player.incScore();
	});

  enemy.on("hurt", () => {
		enemy.color = rand(rgb(0, 0, 0), rgb(255, 255, 255));
	});

  enemy.collides("bullet", (b) => {
    enemy.hurt(enemy.isInsane() ? 10 : 1);
    destroy(b);
    play("hit", {
			detune: rand(-1200, 1200),
			speed: rand(0.2, 2),
		});
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
      const speed = enemy.isInsane() ? MISSILE_INSANE_SPEED : MISSILE_SPEED;
      add([
        sprite("missile"),
        area(),
        k.pos(enemy.pos.x, enemy.pos.y),
        move(angle, speed),
        cleanup(),
        "missile",
      ]);
      wait(rand(0.5, 1.5), spawnMissile.bind(null, enemy));
    }
  }

  spawnMissile(enemy);
}
