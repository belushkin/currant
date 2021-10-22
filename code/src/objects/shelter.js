import k from "./../../kaboom";

loadSprite("sand", "sprites/sand.png");

export default function spawnShelters() {

  // left
  for (let i = 0; i < 5; i++) {
    add([
      sprite("sand"),
      area(),
      pos(width() / 4, (height() / 4)+i*63),
      "shelter",
    ]);
  }

  // top
  for (let i = 0; i < 5; i++) {
    add([
      sprite("sand"),
      area(),
      pos(width() +i*63, (height() / 2)),
      "shelter",
    ]);
  }

  // bottom
  for (let i = 0; i < 5; i++) {
    add([
      sprite("sand"),
      area(),
      pos(width() +i*63, (height()*2 - height()/2)),
      "shelter",
    ]);
  }

  collides("bullet", "shelter", (b, s) => {
    destroy(b);
  });
  collides("missile", "shelter", (m, s) => {
    destroy(m);
  });
}
