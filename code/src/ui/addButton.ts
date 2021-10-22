import {Vec2} from "kaboom";
import k from "../../kaboom"

export default function addButton(txt: string, p: Vec2, f: () => void) {
	const btn = k.add([
		k.text(txt),
		pos(p),
    layer("ui"),
		area({ cursor: "pointer", }),
		scale(1),
		origin("center")
	]);

	btn.clicks(f);
	btn.hovers(() => {
		const t = time() * 10;
		btn.color = rgb(
			wave(0, 255, t),
			wave(0, 255, t + 2),
			wave(0, 255, t + 4),
		);
		btn.scale = vec2(1.2);
	}, () => {
		btn.scale = vec2(1);
		btn.color = rgb(0,0,0);
	});
}

