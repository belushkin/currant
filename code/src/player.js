import k from "./../kaboom";
import big from "./big";

loadSprite("bean", "sprites/bean.png");

export default function getPlayer(tag) {
  const player = k.add([
    sprite("bean"),
    pos(center()),
    area(),
    scale(1),
    big(),
    tag,
  ]);
  return player;
}
