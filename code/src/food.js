import k from "./../kaboom";

loadSprite("apple", "sprites/apple.png");

export default function spawnFood() {
  // add food obj
  add([
    sprite("apple"),
    scale(0.5),
    area(),
    pos(rand(0, width()), rand(0, height())),
    "food",
  ]);

  // wait a random amount of time to spawn next tree
  wait(rand(0.5, 1.5), spawnFood);
}
