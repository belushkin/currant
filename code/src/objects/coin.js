loadSprite("coin", "sprites/pizza.png");

export default function spawnCoin(position, uuid) {
  // add food obj
  add([
    sprite("coin"),
    scale(0.5),
    area(),
    pos(position),
    "coin",
    uuid
  ]);
}
