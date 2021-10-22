import k from "./../../kaboom";

loadSprite("grape", "sprites/grape.png");

export default function spawnFood(pos, uuid) {
  // add food obj
  add([
    sprite("grape"),
    scale(0.5),
    area(),
    k.pos(pos),
    "food",
    uuid
  ]);
}
