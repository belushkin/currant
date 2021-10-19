import k from './../kaboom'

export default function spawnFood() {
  // add food obj
  add([
    rect(18, rand(12, 26)),
    area(),
    outline(1),
    pos(rand(0, width()), rand(0, height())),
    color(255, 180, 255),
    "food",
  ]);

  // wait a random amount of time to spawn next tree
  wait(rand(0.5, 1.5), spawnFood);
}
