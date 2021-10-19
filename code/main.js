import k from './kaboom'
import {border_map} from './map'
import spawnFood from './food'
import getPlayer from './player'

const SPEED = 480;

k.scene("game", () => {

  // Draw borders
  border_map();
  
  // Init player
  const currant = getPlayer('currant');
  let current_direction = null;

  const directions = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  // start spawning foods
	spawnFood();

  // jump when user press space
	// keyPress("left", moveLeft);
  // keyPress("right", moveRight);

  action(() => {
      if (keyIsDown("left")) {
          current_direction = directions.UP;
          currant.move(-SPEED, 0);
      }
      if (keyIsDown("right")) {
          currant.move(SPEED, 0);
      }
      if (keyIsDown("down")) {
          currant.move(0, SPEED);
      }
      if (keyIsDown("up")) {
          currant.move(0, -SPEED);
      }
  });

  currant.collides("food", (food) => {
      destroy(food);
  });

  // action(() => {
  //   camPos(vec2(0, 100));
  // });

});


go("game");
