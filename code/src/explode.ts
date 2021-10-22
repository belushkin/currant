import { Vec2 } from "kaboom";
import k from "./../kaboom";

function grow(rate: number) {
  return {
    update() {
      const n = rate * dt();
      this.scale.x += n;
      this.scale.y += n;
    },
  };
}

export default function addExplode(
  p: Vec2,
  n: number,
  rad: number,
  size: number
) {
  for (let i = 0; i < n; i++) {
    wait(rand(n * 0.1), () => {
      for (let i = 0; i < 2; i++) {
        add([
          pos(p.add(rand(vec2(-rad), vec2(rad)))),
          rect(4, 4),
          outline(4),
          scale(1 * size, 1 * size),
          lifespan(0.1),
          grow(rand(48, 72) * size),
          k.origin("center"),
          fixed(),
        ]);
      }
    });
  }
}
