import k from './../kaboom'

const directions = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
};

const SPEED = 480;

let run_action = false;

export function setMoveAction(player) {
  k.action(() => {
      // if (!run_action) return;

      if (k.keyIsDown("left")) {
          player.move(-SPEED, 0);
      }
      if (k.keyIsDown("right")) {
         player.move(SPEED, 0);
      }
      if (k.keyIsDown("down")) {
          player.move(0, SPEED);
      }
      if (k.keyIsDown("up")) {
          player.move(0, -SPEED);
      }
  });
}
