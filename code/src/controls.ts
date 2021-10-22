import k from "./../kaboom";
import PlayerModel from "./playerModel";

export default function setControls(playerModel: PlayerModel, width: number, height: number) {
  k.action(() => {
    let pad = vec2(0, 0);
    const base = vec2(0, 0);

    if (k.keyIsDown("left") || k.keyIsDown("a")) {
      pad.x -= 1;
    }
    if (k.keyIsDown("right") || k.keyIsDown("d")) {
      pad.x += 1;
    }

    if (k.keyIsDown("down") || k.keyIsDown("s")) {
      pad.y += 1;
    }
    if (k.keyIsDown("up") || k.keyIsDown("w")) {
      pad.y -= 1;
    }

    if (k.mouseIsDown()) {
      pad = k.mouseWorldPos().sub(playerModel.getPos());
      if (pad.len() < 100) {
        pad = vec2(0, 0);
      }
    }

    if (pad.len() > 0) {
      playerModel.setMove(pad.angle(base));
    } else {
      playerModel.stop();
    }

    // obstacles
    if (playerModel.getPos().x < 0) {
      playerModel.setPosition(0, playerModel.getPos().y);
    }
    if (playerModel.getPos().x > width * 2) {
      playerModel.setPosition(width * 2, playerModel.getPos().y);
    }
    if (playerModel.getPos().y > height * 2) {
      playerModel.setPosition(playerModel.getPos().x, height * 2);
    }
    if (playerModel.getPos().y < 0) {
      playerModel.setPosition(playerModel.getPos().x, 0);
    }

    // center camera
    camPos(playerModel.getPos());
  });

  keyPress("space", () => {
    const angle = mouseWorldPos().angle(playerModel.getPos());
    playerModel.shot(angle);
    // play("shoot", {
    // 	volume: 0.3,
    // 	detune: rand(-1200, 1200),
    // });
  });

  keyPress("q", () => {
    go("end");
  });

  playerModel.getPlayerObject().collides("wall", () => {
    shake(12);
  });
}
