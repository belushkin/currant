import k from "./../../kaboom";

loadSprite("grape", "sprites/grape.png");

export default function spawnFood() {
  // add food obj
  add([
    sprite("grape"),
    scale(0.5),
    area(),
    pos(rand(0, width() * 2), rand(0, height() * 2)),
    "food",
  ]);

  // wait a random amount of time to spawn next tree
  wait(rand(0.5, 1.5), spawnFood);
}
