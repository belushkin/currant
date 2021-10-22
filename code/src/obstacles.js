import k from "./../kaboom";

export default function showObstacles(width, height) {
  // left
  k.add([pos(0, 0), rect(10, height * 2), outline(4), area(), "wall"]);

  // top
  k.add([pos(0, 0), rect(width * 2, 10), outline(4), area(), "wall"]);

  // bottom
  k.add([
    pos(0, height * 2),
    rect(width * 2, 10),
    outline(4),
    area(),
    "wall",
  ]);

  // right
  k.add([
    pos(width * 2, 0),
    rect(10, height * 2),
    outline(4),
    area(),
    "wall",
  ]);
}
