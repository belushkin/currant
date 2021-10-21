import k from "../../kaboom"
import PlayerModel from "../playerModel";
import addButton from "../ui/addButton"

export default function endScene(player: PlayerModel) {
	add([
		text("Game over. Your score is: " + player.getScore(), { size: 46 }),
		pos(width() / 2, height() / 2),
		k.origin("center"),
		fixed(),
	]);
	addButton("Start", vec2(width() / 2, (height() / 2) + 96) , () => go("battle"));

}
