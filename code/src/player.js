import k from "./../kaboom";
import big from "./big";
import addExplode from "./explode";

loadSprite("bean", "sprites/bean.png");

export default function getPlayer(tag, myself = false) {
  const player = k.add([
    sprite("bean"),
    pos(center()),
    area(),
    scale(1),
    big(),
    tag,
  ]);

  if (myself) {
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
