import {Vec2} from "kaboom";
import k from "../kaboom"

const BULLET_SPEED = 1200;
function spawnBullet(source: Vec2, angle: number) {
    add([
			rect(12, 48),
			area(),
			pos(source),
			k.origin("center"),
			color(127, 127, 255),
			outline(4),
			move(angle, BULLET_SPEED),
			cleanup(),
			"bullet",
		]);
	}

export default function shot(source: Vec2, angle: number): void
{
	spawnBullet(source.sub(16,0), angle);
	spawnBullet(source.add(16,0), angle);
}

