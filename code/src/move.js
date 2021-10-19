import k from "./../kaboom";

const SPEED = 480;

export function setMoveAction(player) {
  k.action(() => {

    if (k.keyIsDown("left")) {
      if (player.pos.x > 10) {
          player.move(-SPEED, 0);
      }
    }
    if (k.keyIsDown("right")) {
      if (player.pos.x < 290) {
        player.move(SPEED, 0);
      }
    }
    if (k.keyIsDown("down")) {
      player.move(0, SPEED);
    }
    if (k.keyIsDown("up")) {
      player.move(0, -SPEED);
    }

    if (player.pos.x > 150) {
      camPos(player.pos);
    }
    if (player.pos.x < 150) {
      camPos(player.pos);
    }
  });
  player.collides("wall", (food) => {
    shake(12);
  });
}
