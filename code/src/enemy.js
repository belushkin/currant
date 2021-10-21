import k from "./../kaboom";

loadSprite("googoly", "sprites/googoly.png");

export default function getEnemy(tag) {
  const enemy = k.add([
    sprite("googoly"),
    pos(0, 0),
    area(),
    move(0,0),
    origin("top"),
    tag,
  ]);
  return enemy;
}