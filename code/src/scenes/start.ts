import k from "../../kaboom"
import addButton from "../ui/addButton"

export default function startScene() {
  k.add([
		text("Play the game: Currant Julep", { size: 26 }),
		pos(width() / 2, height() / 2),
		k.origin("center"),
		fixed(),
	]);

	addButton("Play", vec2(width() / 2, (height() / 2) + 76), () => go("battle"));
	// addButton("Exit", vec2(width() / 2, (height() / 2) + 146), () => go("end"));
}
