import k from './kaboom'

export default function getPlayer(tag) {
  const player = k.add([
      // list of components
      rect(20, 20),
      pos(80, 40),
      color(0, 0, 255),
      area(),
      tag
  ]);
  return player;
}
