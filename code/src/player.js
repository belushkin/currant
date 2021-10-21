import k from "./../kaboom";
import big from "./big";

loadSprite("bean", "sprites/bean.png");

export default function getPlayer(tag) {
  const player = k.add([
    // list of components
    sprite("bean"),
    pos(center()),
    area(),
    move(0,0),
    scale(1),
    big(),
    origin("center"),
    tag,
  ]);
  return player;
}