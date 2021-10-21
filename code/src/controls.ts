import k from "./../kaboom";
import PlayerModel from "./playerModel";

export default function setControls(playerModel: PlayerModel) {
  k.action(() => {
    
    let pad = vec2(0,0);
    const base = vec2(0,0);

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
        pad = vec2(0,0)
      }
    }

    if (pad.len() > 0) {
      playerModel.setMove(pad.angle(base))
    } else {
      playerModel.stop();
    }

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

  /*
  player.collides("wall", (food) => {
    shake(12);
  });
  */
}
