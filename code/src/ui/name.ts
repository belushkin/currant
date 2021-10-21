import PlayerModel from "../playerModel";
import k from "../../kaboom";

export default function showName(player: PlayerModel) {
	k.add([
		k.layer("ui"),
		text(player.name, {
			size: 24
		}),
		pos(12, height() - 36),
		fixed(),
		z(100),
	]);
}

