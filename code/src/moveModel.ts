import k from "./../kaboom";
import PlayerModel from "./playerModel";

export function setMoveAction(playerModel: PlayerModel) {
  k.action(() => {
    
    let pad = vec2(0,0);
    const base = vec2(0,0);

    if (k.keyIsDown("left")) {
      pad.x -= 1;
    } 
    if (k.keyIsDown("right")) {
      pad.x += 1;
    }

    if (k.keyIsDown("down")) {
      pad.y += 1;
    } 
    if (k.keyIsDown("up")) {
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
/*
  player.collides("wall", (food) => {
    shake(12);
  });
  */
}
