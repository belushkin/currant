import k from "./../../kaboom";

loadSprite("coin", "sprites/pizza.png");

export default function spawnCoin() {
  // add food obj
  add([
    sprite("coin"),
    scale(0.5),
    area(),
    pos(rand(0, width() * 2), rand(0, height() * 2)),
    "coin",
  ]);

  // wait a random amount of time to spawn next tree
  wait(rand(0.5, 1.5), spawnCoin);
}
