import { Vec2 } from "kaboom";
import k from "../kaboom";

function spawnBullet(source: Vec2, angle: number, speed: number) {
  add([
    rect(12, 48),
    area(),
    pos(source),
    k.origin("center"),
    color(127, 127, 255),
    outline(4),
    move(angle, speed),
    cleanup(),
    "bullet",
  ]);
}

export default function shot(source: Vec2, angle: number, speed: number): void {
  spawnBullet(source.sub(16, 0), angle, speed);
  spawnBullet(source.add(16, 0), angle, speed);
}
