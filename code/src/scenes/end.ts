import k from "../../kaboom"
import PlayerModel from "../playerModel";
import addButton from "../ui/addButton"
import emitter	 from "../emitter";
import GameEnd from "../events/gameEnd";

export default function endScene(player: PlayerModel) {
	emitter.emit('game.end', new GameEnd(player.getScore()));

	add([
		text("Game over. Your score is: " + player.getScore(), { size: 46 }),
		pos(width() / 2, height() / 2),
		k.origin("center"),
		fixed(),
	]);
	addButton("Play", vec2(width() / 2, (height() / 2) + 96) , () => go("battle"));

}
