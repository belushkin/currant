import k from "./../../kaboom";

loadSprite("heart", "sprites/heart.png");

export default function spawnHeart() {
  // add food obj
  add([
    sprite("heart"),
    scale(0.5),
    area(),
    pos(rand(0, width() * 2), rand(0, height() * 2)),
    "heart",
  ]);

  // wait a random amount of time to spawn next tree
  wait(rand(0.5, 1.5), spawnHeart);
}
