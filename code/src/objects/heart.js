import k from "./../../kaboom";

loadSprite("heart", "sprites/heart.png");

export default function spawnHeart(position, uuid) {
  // add food obj
  add([
    sprite("heart"),
    scale(0.5),
    area(),
    pos(position),
    "heart",
    uuid
  ]);

}
