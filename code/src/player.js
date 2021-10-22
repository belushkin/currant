import k from "./../kaboom";
import big from "./components/big";
import insane from "./components/insane";
import addExplode from "./explode";

loadSprite("bean", "sprites/bean.png");

const PLAYER_HEALTH = 1000;

export default function getPlayer(tag, myself = false, god = false) {
  const player = k.add([
    sprite("bean"),
    pos(center()),
    area(),
    scale(1),
    health(PLAYER_HEALTH),
    big(),
    insane(),
    tag,
  ]);

  player.collides("coin", (coin) => {
    destroy(coin);
    player.insanity(1.5);
  });
  
  action("bullet", (b) => {
		if (player.isInsane()) {
			b.color = rand(rgb(0, 0, 0), rgb(255, 255, 255));
		}
  });

  if (myself && ! god) {
    player.collides("food", (food) => {
      destroy(food);
      player.biggify(0.5);
    });

    player.collides("enemy", (e) => {
      destroy(e);
      destroy(player);
      shake(120);
      // play("explode");
      // music.detune(-1200);
      addExplode(center(), 12, 120, 30);
      wait(1, () => {
        // music.stop();
        go("end");
      });
    });

    player.collides("missile", (m) => {
      destroy(m);
      destroy(player);
      shake(120);
      // play("explode");
      // music.detune(-1200);
      wait(1, () => {
        // music.stop();
        go("end");
      });
    });


  }

  return player;
}
